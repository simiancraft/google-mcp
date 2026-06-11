import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations } from '../lib/operation.js';
import { renderCapabilities } from '../lib/server.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

const operations = mergeOperations(tools, methods);

describe('calendar operations', () => {
  it('exposes the full surface (8 tools, 17 methods)', () => {
    expect(Object.keys(tools)).toHaveLength(8);
    expect(Object.keys(methods)).toHaveLength(17);
    expect(Object.keys(operations)).toHaveLength(25);
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
    expect(destructive).toEqual(['clear_calendar', 'delete_calendar', 'delete_event']);
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url)), 'utf8');
    expect(doc).toBe(
      renderCapabilities('Calendar capabilities', [
        { kind: 'MCP Tool', operations: tools },
        { kind: 'REST Method', operations: methods },
      ]),
    );
  });
});
