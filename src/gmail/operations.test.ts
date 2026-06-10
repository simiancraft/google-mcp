import { describe, expect, it } from 'bun:test';
import { mergeOperations } from '../lib/operation.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

const operations = mergeOperations(tools, methods);

describe('gmail operations', () => {
  it('exposes the full surface (10 tools + 23 methods)', () => {
    expect(Object.keys(tools)).toHaveLength(10);
    expect(Object.keys(methods)).toHaveLength(23);
    expect(Object.keys(operations)).toHaveLength(33);
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
    expect(destructive).toEqual([
      'batch_delete_messages',
      'create_filter',
      'delete_message',
      'delete_thread',
      'send_draft',
      'send_message',
    ]);
  });
});
