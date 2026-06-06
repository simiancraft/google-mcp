import { describe, expect, it, mock, spyOn } from 'bun:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { z } from 'zod';
import { callTool, createServer, toolDefinitions } from './createServer.js';
import { makeDefineTool } from './defineTool.js';

type FakeClient = { upper: (s: string) => string };
const defineTool = makeDefineTool<FakeClient>();

const echo = defineTool({
  description: 'Uppercase a string.',
  input: z.object({ text: z.string() }),
  output: z.object({ shouted: z.string() }),
  handler: async (client, args) => ({ shouted: client.upper(args.text) }),
});

const boom = defineTool({
  description: 'Always throws.',
  input: z.object({}),
  output: z.object({}),
  handler: async () => {
    throw new Error('kaboom');
  },
});

const tools = { echo, boom };
const client: FakeClient = { upper: (s) => s.toUpperCase() };

describe('callTool', () => {
  it('validates input, runs the handler, and returns structuredContent', async () => {
    const result = await callTool(tools, client, 'echo', { text: 'hi' });
    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toEqual({ shouted: 'HI' });
    expect(result.content[0]).toMatchObject({ type: 'text' });
  });

  it('returns an error result for an unknown tool', async () => {
    const result = await callTool(tools, client, 'nope', {});
    expect(result.isError).toBe(true);
  });

  it('returns an error result for invalid input', async () => {
    const result = await callTool(tools, client, 'echo', { text: 42 });
    expect(result.isError).toBe(true);
  });

  it('returns an error result when the handler throws', async () => {
    const result = await callTool(tools, client, 'boom', {});
    expect(result.isError).toBe(true);
    expect(result.content[0]).toMatchObject({ text: expect.stringContaining('kaboom') });
  });
});

describe('toolDefinitions', () => {
  const danger = defineTool({
    description: 'Irreversible.',
    destructive: true,
    input: z.object({ id: z.string() }),
    output: z.object({ ok: z.boolean() }),
    handler: async () => ({ ok: true }),
  });

  it('emits input and output JSON Schema and a destructive hint only when set', () => {
    const defs = toolDefinitions({ echo, danger });
    const echoDef = defs.find((d) => d.name === 'echo');
    const dangerDef = defs.find((d) => d.name === 'danger');

    expect(echoDef?.inputSchema).toBeDefined();
    expect(echoDef?.outputSchema).toBeDefined();
    expect('annotations' in (echoDef ?? {})).toBe(false);
    expect(dangerDef?.annotations).toEqual({ destructiveHint: true });
  });
});

describe('createServer', () => {
  it('serves tools over a transport: lists and dispatches through the protocol', async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await createServer({
      name: 'test',
      tools: { echo },
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

  it('runs the auth flow and exits on the `auth` subcommand', async () => {
    const argv = process.argv;
    process.argv = ['node', 'script', 'auth', 'someone@example.com'];
    const exitSpy = spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`exit:${code}`);
    }) as never);
    const runAuth = mock(async () => {});
    try {
      await expect(
        createServer({ name: 'test', tools: {}, client: async () => client, runAuth }),
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
        createServer({ name: 'test', tools: {}, client: async () => client }),
      ).rejects.toThrow('exit:1');
    } finally {
      process.argv = argv;
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });
});
