import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations, SOURCE_META_KEY } from '../lib/operation.js';
import { renderCapabilities, toolDefinitions } from '../lib/server.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';

const operations = mergeOperations(methods);

describe('sheets operations', () => {
  it('exposes the full surface (15 methods; methods-only, no MCP toolset)', () => {
    expect(Object.keys(methods)).toHaveLength(15);
    expect(Object.keys(operations)).toHaveLength(15);
  });

  it('every operation has a description, a schema, and a handler', () => {
    for (const op of Object.values(operations)) {
      expect(op.description.length).toBeGreaterThan(0);
      expect(op.schema.input).toBeDefined();
      expect(op.schema.output).toBeDefined();
      expect(typeof op.handler).toBe('function');
    }
  });

  it('declares strict inputs on the wire (additionalProperties: false)', () => {
    for (const def of toolDefinitions(operations)) {
      expect(def.inputSchema['additionalProperties']).toBe(false);
    }
  });

  it('instructions cite the real _meta key and only real operation names', () => {
    expect(instructions).toContain(SOURCE_META_KEY);
    const mentioned = instructions.match(/\b[a-z]+(?:_[a-z]+)+\b/g) ?? [];
    expect(mentioned.length).toBeGreaterThan(0);
    for (const name of mentioned) {
      expect(operations).toHaveProperty(name);
    }
  });

  it('cites the matching REST reference page on every operation', () => {
    for (const op of Object.values(methods)) {
      expect(op.source).toMatch(
        /^https:\/\/developers\.google\.com\/workspace\/sheets\/api\/reference\/rest\/v4\//,
      );
      expect(op.source).not.toContain('mcp/tools_list');
    }
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
    expect(readOnly).toEqual([
      'batch_get_values',
      'batch_get_values_by_data_filter',
      'get_developer_metadata',
      'get_spreadsheet',
      'get_values',
      'search_developer_metadata',
    ]);
  });

  it('marks exactly the clears destructive (removals; updates are not, per the rubric)', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.annotations.destructiveHint)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([
      'batch_clear_values',
      'batch_clear_values_by_data_filter',
      'clear_values',
    ]);
  });

  it('declares the whole surface closed-world', () => {
    const openWorld = Object.values(operations).filter((op) => op.annotations.openWorldHint);
    expect(openWorld).toEqual([]);
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url)), 'utf8');
    expect(doc).toBe(
      renderCapabilities('Sheets capabilities', [{ kind: 'REST Method', operations: methods }]),
    );
  });
});
