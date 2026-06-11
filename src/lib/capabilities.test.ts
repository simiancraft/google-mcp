import { describe, expect, it, spyOn } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { renderCapabilities, writeCapabilities } from './capabilities.js';
import { operation } from './operation.js';

const read = operation({
  description: 'Read a thing.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/example/reference/rest/v1/things/read',
  schema: { input: z.object({}), output: z.object({}) },
  handler: async (_client: unknown) => ({}),
});

describe('writeCapabilities', () => {
  it('writes CAPABILITIES.md beside the bootstrap module and logs the count', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'caps-'));
    const errSpy = spyOn(console, 'error').mockImplementation(() => {});
    try {
      const moduleUrl = pathToFileURL(path.join(dir, 'capabilities.ts')).href;
      const groups = [{ kind: 'REST Method' as const, operations: { read } }];
      writeCapabilities(moduleUrl, 'Example capabilities', groups);
      const written = readFileSync(path.join(dir, 'CAPABILITIES.md'), 'utf8');
      expect(written).toBe(renderCapabilities('Example capabilities', groups));
      expect(errSpy).toHaveBeenCalledWith('Wrote CAPABILITIES.md (1 operations)');
    } finally {
      errSpy.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

const echo = operation({
  description: 'Uppercase a string.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/example/reference/rest/v1/things/read',
  schema: {
    input: z.strictObject({ text: z.string() }),
    output: z.object({ shouted: z.string() }),
  },
  handler: async (_client: unknown, args: { text: string }) => ({ shouted: args.text }),
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
  schema: { input: z.strictObject({ id: z.string() }), output: z.object({ ok: z.boolean() }) },
  handler: async (_client: unknown) => ({ ok: true }),
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
