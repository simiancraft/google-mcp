import { describe, expect, it, mock, spyOn } from 'bun:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { z } from 'zod';
import { operation, SOURCE_META_KEY } from './operation.js';
import { callOperation, renderCapabilities, server, toolDefinitions } from './server.js';

type FakeClient = { upper: (s: string) => string };

const echo = operation({
  description: 'Uppercase a string.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/example/reference/rest/v1/things/read',
  schema: { input: z.object({ text: z.string() }), output: z.object({ shouted: z.string() }) },
  handler: async (client: FakeClient, args) => ({ shouted: client.upper(args.text) }),
});

const boom = operation({
  description: 'Always throws.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/example/reference/rest/v1/things/read',
  schema: { input: z.object({}), output: z.object({}) },
  handler: async (_client: FakeClient) => {
    throw new Error('kaboom');
  },
});

const danger = operation({
  description: 'Irreversible.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/example/reference/rest/v1/things/delete',
  schema: { input: z.object({ id: z.string() }), output: z.object({ ok: z.boolean() }) },
  handler: async (_client: FakeClient) => ({ ok: true }),
});

const operations = { echo, boom };
const client: FakeClient = { upper: (s) => s.toUpperCase() };

describe('callOperation', () => {
  it('validates input, runs the handler, and returns structuredContent', async () => {
    const result = await callOperation(operations, client, 'echo', { text: 'hi' });
    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toEqual({ shouted: 'HI' });
    expect(result.content[0]).toMatchObject({ type: 'text' });
  });

  it('returns an error result for an unknown operation', async () => {
    const result = await callOperation(operations, client, 'nope', {});
    expect(result.isError).toBe(true);
  });

  it('treats inherited Object keys as unknown operations, not dispatch targets', async () => {
    for (const name of ['__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
      const result = await callOperation(operations, client, name, {});
      expect(result.isError).toBe(true);
      expect(result.content[0]).toMatchObject({
        text: expect.stringContaining(`Unknown tool: ${name}`),
      });
    }
  });

  it('returns an error result for invalid input', async () => {
    const result = await callOperation(operations, client, 'echo', { text: 42 });
    expect(result.isError).toBe(true);
  });

  it('returns an error result when the handler throws', async () => {
    const result = await callOperation(operations, client, 'boom', {});
    expect(result.isError).toBe(true);
    expect(result.content[0]).toMatchObject({ text: expect.stringContaining('kaboom') });
  });
});

describe('toolDefinitions', () => {
  it('emits input and output JSON Schema and the declared annotations', () => {
    const defs = toolDefinitions({ echo, danger });
    const echoDef = defs.find((d) => d.name === 'echo');
    const dangerDef = defs.find((d) => d.name === 'danger');

    expect(echoDef?.inputSchema).toBeDefined();
    expect(echoDef?.outputSchema).toBeDefined();
    expect(echoDef?.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
    expect(dangerDef?.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false,
    });
  });

  it('emits the source citation under the namespaced _meta key', () => {
    const defs = toolDefinitions({ echo, danger });
    const dangerDef = defs.find((d) => d.name === 'danger');
    const echoDef = defs.find((d) => d.name === 'echo');
    expect(dangerDef?._meta).toEqual({
      [SOURCE_META_KEY]: 'https://developers.google.com/example/reference/rest/v1/things/delete',
    });
    expect(echoDef?._meta).toEqual({
      [SOURCE_META_KEY]: 'https://developers.google.com/example/reference/rest/v1/things/read',
    });
  });

  it('emits declared tool annotations verbatim', () => {
    const reader = operation({
      description: 'Reads things.',
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      source: 'https://developers.google.com/example/reference/rest/v1/things/read',
      schema: { input: z.object({}), output: z.object({}) },
      handler: async (_client: FakeClient) => ({}),
    });
    const defs = toolDefinitions({ reader });
    expect(defs[0]?.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('renderCapabilities', () => {
  it('renders a Markdown table, marking only destructive operations', () => {
    const md = renderCapabilities('Test capabilities', [
      { kind: 'MCP Tool', operations: { echo } },
      { kind: 'REST Method', operations: { danger } },
    ]);
    expect(md).toContain('# Test capabilities');
    expect(md).toContain('2 operations across MCP tools and REST methods.');
    expect(md).toContain(
      '| [`echo`](https://developers.google.com/example/reference/rest/v1/things/read) | MCP Tool | Uppercase a string. |',
    );
    expect(md).toContain(
      '| [`danger`](https://developers.google.com/example/reference/rest/v1/things/delete) ⚠️ | REST Method | Irreversible. |',
    );
  });

  it('describes a single-source surface without claiming the other source', () => {
    const md = renderCapabilities('Methods-only capabilities', [
      { kind: 'REST Method', operations: { echo, danger } },
    ]);
    expect(md).toContain('2 operations, all REST methods.');
    expect(md).not.toContain('across MCP tools');
  });
});

describe('server', () => {
  it('serves operations over a transport: lists and dispatches through the protocol', async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server({
      name: 'test',
      operations: { echo },
      client: async () => client,
      transport: serverTransport,
    });

    const mcp = new Client({ name: 'test-client', version: '0' });
    await mcp.connect(clientTransport);

    const list = await mcp.listTools();
    expect(list.tools.map((t) => t.name)).toContain('echo');

    const res = await mcp.callTool({ name: 'echo', arguments: { text: 'hi' } });
    expect(res.structuredContent).toEqual({ shouted: 'HI' });

    await mcp.close();
  });

  it('serves identity metadata and instructions through the initialize result', async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server({
      name: 'test',
      title: 'Test (google-mcp-suite)',
      description: 'A test server.',
      instructions: 'Bound to one account; see tools/list.',
      operations: { echo },
      client: async () => client,
      transport: serverTransport,
    });

    const mcp = new Client({ name: 'test-client', version: '0' });
    await mcp.connect(clientTransport);

    expect(mcp.getServerVersion()).toMatchObject({
      name: 'test',
      title: 'Test (google-mcp-suite)',
      description: 'A test server.',
      websiteUrl: 'https://github.com/simiancraft/google-mcp-suite#readme',
    });
    expect(mcp.getInstructions()).toBe('Bound to one account; see tools/list.');

    await mcp.close();
  });

  it('runs the auth flow and exits on the `auth` subcommand', async () => {
    const argv = process.argv;
    process.argv = ['node', 'script', 'auth', 'someone@example.com'];
    const exitSpy = spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`exit:${code}`);
    }) as never);
    const runAuth = mock(async () => {});
    try {
      await expect(
        server({ name: 'test', operations: {}, client: async () => client, runAuth }),
      ).rejects.toThrow('exit:0');
      expect(runAuth).toHaveBeenCalledWith('someone@example.com');
    } finally {
      process.argv = argv;
      exitSpy.mockRestore();
    }
  });

  it('exits with an error when the auth subcommand has no flow configured', async () => {
    const argv = process.argv;
    process.argv = ['node', 'script', 'auth'];
    const exitSpy = spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`exit:${code}`);
    }) as never);
    const errSpy = spyOn(console, 'error').mockImplementation(() => {});
    try {
      await expect(
        server({ name: 'test', operations: {}, client: async () => client }),
      ).rejects.toThrow('exit:1');
    } finally {
      process.argv = argv;
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });
});
