import { describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { readJsonFile } from './json.js';

const Shape = z.object({ name: z.string() });

describe('readJsonFile', () => {
  it('parses and validates in one step', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'json-util-'));
    try {
      const file = path.join(dir, 'ok.json');
      writeFileSync(file, '{"name":"x","extra":1}');
      expect(readJsonFile(file, Shape)).toEqual({ name: 'x' });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws on a missing file and on a shape mismatch', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'json-util-'));
    try {
      expect(() => readJsonFile(path.join(dir, 'absent.json'), Shape)).toThrow(/ENOENT/);
      const file = path.join(dir, 'bad.json');
      writeFileSync(file, '{"name":42}');
      expect(() => readJsonFile(file, Shape)).toThrow();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
