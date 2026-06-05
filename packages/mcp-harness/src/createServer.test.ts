import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { callTool } from './createServer.js';
import { makeDefineTool } from './defineTool.js';

type FakeClient = { upper: (s: string) => string };
const defineTool = makeDefineTool<FakeClient>();

const echo = defineTool({
  description: 'Uppercase a string.',
  input: z.object({ text: z.string() }),
  output: z.object({ shouted: z.string() }),
  handler: async (client, args) => ({ shouted: client.upper(args.text) }),
});

const tools = { echo };
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
});
