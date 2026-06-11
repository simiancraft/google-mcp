import { describe, expect, it, spyOn } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { writeCapabilities } from './capabilities.js';
import { operation } from './operation.js';
import { renderCapabilities } from './server.js';

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
