import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations } from '../lib/operation.js';
import { renderCapabilities } from '../lib/server.js';
import { methods } from './methods/registry.js';

const operations = mergeOperations(methods);

describe('docs operations', () => {
  it('exposes the full surface (2 methods; methods-only, no MCP toolset)', () => {
    expect(Object.keys(methods)).toHaveLength(2);
    expect(Object.keys(operations)).toHaveLength(2);
  });

  it('annotates every operation with the four MCP hints, explicitly', () => {
    for (const op of Object.values(operations)) {
      expect(typeof op.annotations.readOnlyHint).toBe('boolean');
      expect(typeof op.annotations.destructiveHint).toBe('boolean');
      expect(typeof op.annotations.idempotentHint).toBe('boolean');
      expect(typeof op.annotations.openWorldHint).toBe('boolean');
    }
  });

  it('marks exactly the read-only operations', () => {
    const readOnly = Object.entries(operations)
      .filter(([, op]) => op.annotations.readOnlyHint)
      .map(([name]) => name)
      .sort();
    expect(readOnly).toEqual(['get_document']);
  });

  it('marks exactly the destructive operations', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.annotations.destructiveHint)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([]);
  });

  it('declares the whole surface closed-world', () => {
    const openWorld = Object.values(operations).filter((op) => op.annotations.openWorldHint);
    expect(openWorld).toEqual([]);
  });

  it('cites the matching REST reference page on every operation', () => {
    for (const op of Object.values(methods)) {
      expect(op.source).toMatch(/^https:\/\/developers\.google\.com\/.+\/reference\/rest\//);
      expect(op.source).not.toContain('mcp/tools_list');
    }
  });

  it('every operation has a description, a schema, and a handler', () => {
    for (const op of Object.values(operations)) {
      expect(op.description.length).toBeGreaterThan(0);
      expect(op.schema.input).toBeDefined();
      expect(op.schema.output).toBeDefined();
      expect(typeof op.handler).toBe('function');
    }
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url)), 'utf8');
    expect(doc).toBe(
      renderCapabilities('Docs capabilities', [{ kind: 'REST Method', operations: methods }]),
    );
  });
});
