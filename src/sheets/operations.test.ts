import { describe, expect, it } from 'bun:test';
import { mergeOperations } from '../lib/operation.js';
import { methods } from './methods/registry.js';

const operations = mergeOperations(methods);

describe('sheets operations', () => {
  it('exposes the full surface (3 methods; methods-only, no MCP toolset)', () => {
    expect(Object.keys(methods)).toHaveLength(3);
    expect(Object.keys(operations)).toHaveLength(3);
  });

  it('every operation has a description, a schema, and a handler', () => {
    for (const op of Object.values(operations)) {
      expect(op.description.length).toBeGreaterThan(0);
      expect(op.schema.input).toBeDefined();
      expect(op.schema.output).toBeDefined();
      expect(typeof op.handler).toBe('function');
    }
  });

  it('marks exactly the irreversible operations destructive', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.destructive)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([]);
  });
});
