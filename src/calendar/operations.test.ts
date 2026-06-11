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

  it('annotates every operation with the four MCP hints, explicitly', () => {
    for (const op of Object.values(operations)) {
      expect(typeof op.annotations?.readOnlyHint).toBe('boolean');
      expect(typeof op.annotations?.destructiveHint).toBe('boolean');
      expect(typeof op.annotations?.idempotentHint).toBe('boolean');
      expect(typeof op.annotations?.openWorldHint).toBe('boolean');
    }
  });

  it('marks exactly the read-only operations', () => {
    const readOnly = Object.entries(operations)
      .filter(([, op]) => op.annotations?.readOnlyHint)
      .map(([name]) => name)
      .sort();
    expect(readOnly).toEqual([
      'get_calendar',
      'get_calendar_entry',
      'get_colors',
      'get_event',
      'get_setting',
      'list_calendars',
      'list_event_instances',
      'list_events',
      'list_settings',
      'query_free_busy',
      'suggest_time',
    ]);
  });

  it('marks exactly the destructive operations (deletes, clear, unsubscribe)', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.annotations?.destructiveHint)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([
      'clear_calendar',
      'delete_calendar',
      'delete_event',
      'remove_calendar_entry',
    ]);
  });

  it('declares the whole surface closed-world', () => {
    const openWorld = Object.values(operations).filter((op) => op.annotations?.openWorldHint);
    expect(openWorld).toEqual([]);
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
