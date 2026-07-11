import { afterAll, beforeAll, expect, it, spyOn } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { z } from 'zod';
import {
  bridgeTransports,
  buildApp,
  type ChildFactory,
  childEnv,
  closeAllSessions,
  closeQuietly,
  serviceEntry,
  spawnChild,
} from './http.js';

const ACCOUNT = 'me@example.com';
const AUTH_TOKEN = 'sekret';

let server: Server;
let base: string;
let dir: string;
let savedDir: string | undefined;
let savedToken: string | undefined;
let childrenClosed = 0;

/**
 * The default child is a spawned stdio bin; here we inject an in-process MCP
 * server over InMemoryTransport so the full HTTP↔child JSON-RPC bridge runs
 * without a child process. Each session gets its own server, bound to the
 * account the URL carried, mirroring one-account-per-process.
 */
const childFactory: ChildFactory = (account, service): Transport => {
  const [childEnd, serverEnd] = InMemoryTransport.createLinkedPair();
  const mcp = new McpServer({ name: `stub-${service}`, version: '0' });
  mcp.registerTool(
    'whoami',
    {
      description: 'Reports the account and service this stub is bound to.',
      inputSchema: {},
      outputSchema: { account: z.string(), service: z.string() },
    },
    async () => {
      const out = { account, service };
      return { content: [{ type: 'text', text: JSON.stringify(out) }], structuredContent: out };
    },
  );
  void mcp.connect(serverEnd);
  const originalClose = childEnd.close.bind(childEnd);
  childEnd.close = async () => {
    childrenClosed += 1;
    await originalClose();
  };
  return childEnd;
};

beforeAll(async () => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'google-mcp-session-'));
  savedDir = process.env['GOOGLE_MCP_DIR'];
  savedToken = process.env['GOOGLE_MCP_TOKEN'];
  process.env['GOOGLE_MCP_DIR'] = dir;
  // A leaked single-account override would repoint tokenPath; clear it so the
  // per-account tokens/<account>.json this test writes is what gets read.
  delete process.env['GOOGLE_MCP_TOKEN'];
  mkdirSync(path.join(dir, 'tokens'), { recursive: true });
  writeFileSync(
    path.join(dir, 'tokens', `${ACCOUNT}.json`),
    JSON.stringify({ access_token: 'a', refresh_token: 'r' }),
  );

  const savedAuth = process.env['AUTH_TOKEN'];
  process.env['AUTH_TOKEN'] = AUTH_TOKEN; // read at buildApp() time and captured
  server = buildApp({ childFactory }).listen(0, '127.0.0.1');
  if (savedAuth === undefined) delete process.env['AUTH_TOKEN'];
  else process.env['AUTH_TOKEN'] = savedAuth;

  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  closeAllSessions();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (savedDir === undefined) delete process.env['GOOGLE_MCP_DIR'];
  else process.env['GOOGLE_MCP_DIR'] = savedDir;
  if (savedToken === undefined) delete process.env['GOOGLE_MCP_TOKEN'];
  else process.env['GOOGLE_MCP_TOKEN'] = savedToken;
  rmSync(dir, { recursive: true, force: true });
});

async function connect(): Promise<{ client: Client; transport: StreamableHTTPClientTransport }> {
  const transport = new StreamableHTTPClientTransport(new URL(`${base}/${ACCOUNT}/gmail`), {
    requestInit: { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } },
  });
  const client = new Client({ name: 'test', version: '0' });
  // The SDK's own client transport types sessionId as `string | undefined`, which
  // exactOptionalPropertyTypes rejects against Transport's optional `sessionId?`.
  await client.connect(transport as unknown as Transport);
  return { client, transport };
}

it('rejects a request with the wrong bearer token (401)', async () => {
  const res = await fetch(`${base}/${ACCOUNT}/gmail`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer wrong' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
  });
  expect(res.status).toBe(401);
  expect(await res.json()).toEqual({ error: 'unauthorized' });
});

it('bridges an MCP session to the child and dispatches a tool call', async () => {
  const { client, transport } = await connect();

  const list = await client.listTools();
  expect(list.tools.map((t) => t.name)).toContain('whoami');

  const res = await client.callTool({ name: 'whoami', arguments: {} });
  // The child was spawned bound to the URL's account/service.
  expect(res.structuredContent).toEqual({ account: ACCOUNT, service: 'gmail' });

  // The root now reports the session as open and the account as authorized.
  const health = (await (await fetch(`${base}/healthz`)).json()) as { sessions: number };
  expect(health.sessions).toBeGreaterThanOrEqual(1);
  const root = (await (await fetch(`${base}/`)).json()) as { accounts: string[] };
  expect(root.accounts).toContain(ACCOUNT);

  // DELETE tears the session down through handleSessionRequest.
  await transport.terminateSession();
  await client.close();
});

it('rejects a session id that does not match the addressed account/service (400)', async () => {
  // Open a real session, capture its id, then reuse it on a different route.
  const { client, transport } = await connect();
  const sessionId = transport.sessionId;
  expect(sessionId).toBeString();

  const res = await fetch(`${base}/${ACCOUNT}/calendar`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${AUTH_TOKEN}`,
      'mcp-session-id': sessionId ?? '',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'tools/list', params: {} }),
  });
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: { message: string } }).error.message).toMatch(
    /no valid session/,
  );

  await client.close();
});

it('answers a GET with no session id with 400 via handleSessionRequest', async () => {
  const res = await fetch(`${base}/${ACCOUNT}/gmail`, {
    method: 'GET',
    headers: { authorization: `Bearer ${AUTH_TOKEN}` },
  });
  expect(res.status).toBe(400);
  expect(((await res.json()) as { error: { message: string } }).error.message).toMatch(
    /no valid session/,
  );
});

it('rejects a non-initialize POST that carries no session (400)', async () => {
  const res = await fetch(`${base}/${ACCOUNT}/gmail`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${AUTH_TOKEN}` },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }),
  });
  expect(res.status).toBe(400);
});

it('bridgeTransports forwards messages and logs send/transport failures without throwing', async () => {
  const errSpy = spyOn(console, 'error').mockImplementation(() => {});
  const delivered: { http: unknown[]; child: unknown[] } = { http: [], child: [] };

  // Each side's send resolves for one message then rejects, so both the happy
  // forward and the failure log are exercised.
  const makeSide = (sink: unknown[]) => {
    let first = true;
    return {
      onmessage: undefined as ((m: unknown) => void) | undefined,
      onerror: undefined as ((e: Error) => void) | undefined,
      send: (m: unknown) => {
        if (first) {
          first = false;
          sink.push(m);
          return Promise.resolve();
        }
        return Promise.reject(new Error('send failed'));
      },
    };
  };
  const http = makeSide(delivered.child); // http.send delivers toward the child sink
  const child = makeSide(delivered.http);

  bridgeTransports(
    http as unknown as Parameters<typeof bridgeTransports>[0],
    child as unknown as Parameters<typeof bridgeTransports>[1],
    'acct/gmail',
  );

  const msg = { jsonrpc: '2.0', id: 1, method: 'ping' };
  http.onmessage?.(msg); // -> child.send resolves
  child.onmessage?.(msg); // -> http.send resolves
  expect(delivered.http).toHaveLength(1);
  expect(delivered.child).toHaveLength(1);

  http.onmessage?.(msg); // -> child.send rejects -> logged
  child.onmessage?.(msg); // -> http.send rejects -> logged
  http.onerror?.(new Error('http boom'));
  child.onerror?.(new Error('child boom'));

  // Let the rejected send() promises settle so the .catch handlers run.
  await Promise.resolve();
  expect(errSpy).toHaveBeenCalled();
  errSpy.mockRestore();
});

it('closeQuietly swallows a rejecting close()', () => {
  // The empty catch runs; no rejection escapes.
  expect(() => closeQuietly({ close: () => Promise.reject(new Error('nope')) })).not.toThrow();
});

it('the default child factory targets the service bin and binds the account', () => {
  // serviceEntry resolves the sibling <service> bin; childEnv pins the identity.
  expect(serviceEntry('gmail')).toMatch(/[/\\]gmail[/\\]index\.js$/);
  const env = childEnv('you@example.com');
  expect(env['GOOGLE_MCP_ACCOUNT']).toBe('you@example.com');
  expect(env['PATH']).toBe(process.env['PATH']); // inherits the rest of the environment

  // spawnChild constructs (does not start) the stdio transport for that bin.
  const child = spawnChild('you@example.com', 'gmail');
  expect(child).toBeDefined();
  void child.close().catch(() => {});
});

it('answers 500 when the underlying transport throws on GET and POST', async () => {
  const errSpy = spyOn(console, 'error').mockImplementation(() => {});
  const { client, transport } = await connect();
  const sessionId = transport.sessionId ?? '';

  // Force the Streamable HTTP transport to fail after the session is established.
  const spy = spyOn(StreamableHTTPServerTransport.prototype, 'handleRequest').mockRejectedValue(
    new Error('boom'),
  );

  const get = await fetch(`${base}/${ACCOUNT}/gmail`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${AUTH_TOKEN}`,
      accept: 'text/event-stream',
      'mcp-session-id': sessionId,
    },
  });
  expect(get.status).toBe(500);

  const post = await fetch(`${base}/${ACCOUNT}/gmail`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${AUTH_TOKEN}`,
      'mcp-session-id': sessionId,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/list', params: {} }),
  });
  expect(post.status).toBe(500);

  spy.mockRestore();
  errSpy.mockRestore();
  await client.close().catch(() => {});
});

it('closeAllSessions tears down every open child', async () => {
  const before = childrenClosed;
  const { client } = await connect();
  await client.callTool({ name: 'whoami', arguments: {} });

  closeAllSessions();
  // The injected child's close() ran as part of teardown.
  expect(childrenClosed).toBeGreaterThan(before);

  await client.close().catch(() => {});
});
