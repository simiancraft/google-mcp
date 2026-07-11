import { afterAll, beforeAll, expect, it } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { buildApp, SERVICES } from './http.js';

let server: Server;
let base: string;
let dir: string;
let saved: string | undefined;

beforeAll(async () => {
  // Point the credential dir at an empty temp: no account is ever authorized,
  // so every request stops at the authorization check and no child is spawned.
  dir = mkdtempSync(path.join(os.tmpdir(), 'google-mcp-http-'));
  saved = process.env['GOOGLE_MCP_DIR'];
  process.env['GOOGLE_MCP_DIR'] = dir;

  server = buildApp().listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (saved === undefined) delete process.env['GOOGLE_MCP_DIR'];
  else process.env['GOOGLE_MCP_DIR'] = saved;
  rmSync(dir, { recursive: true, force: true });
});

const initBody = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 't', version: '0' },
  },
};

function post(pathname: string, body: unknown) {
  return fetch(`${base}${pathname}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** The JSON-RPC error message from a rejected request. */
async function errorMessage(res: Response): Promise<string> {
  const json = (await res.json()) as { error: { message: string } };
  return json.error.message;
}

it('reports health with the full service list', async () => {
  const res = await fetch(`${base}/healthz`);
  expect(res.status).toBe(200);
  const json = (await res.json()) as { ok: boolean; services: string[] };
  expect(json.ok).toBe(true);
  expect(json.services).toEqual([...SERVICES]);
});

it('describes the server and its (empty) account list at the root', async () => {
  const res = await fetch(`${base}/`);
  const json = (await res.json()) as { transport: string; accounts: string[] };
  expect(json.transport).toBe('streamable-http');
  expect(json.accounts).toEqual([]);
});

it('rejects an invalid account label with 400', async () => {
  const res = await post('/a,b/gmail', initBody);
  expect(res.status).toBe(400);
  expect(await errorMessage(res)).toMatch(/invalid account/);
});

it('rejects an unknown service with 404', async () => {
  const res = await post('/you@example.com/telepathy', initBody);
  expect(res.status).toBe(404);
  expect(await errorMessage(res)).toMatch(/unknown service/);
});

it('rejects an unauthorized account with 404 pointing at /admin', async () => {
  const res = await post('/you@example.com/gmail', initBody);
  expect(res.status).toBe(404);
  expect(await errorMessage(res)).toMatch(/not authorized.*\/admin/);
});
