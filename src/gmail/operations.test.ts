import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations } from '../lib/operation.js';
import { renderCapabilities } from '../lib/server.js';
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

  it('cites a Google reference page on every operation', () => {
    for (const op of Object.values(operations)) {
      expect(op.source).toMatch(/^https:\/\/developers\.google\.com\//);
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
      'download_attachment',
      'get_draft',
      'get_filter',
      'get_label',
      'get_message',
      'get_thread',
      'list_drafts',
      'list_filters',
      'list_labels',
      'list_messages',
      'search_threads',
    ]);
  });

  it('marks exactly the destructive operations (removals, sends, standing filters)', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.annotations?.destructiveHint)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([
      'batch_delete_messages',
      'batch_modify_messages',
      'create_filter',
      'delete_draft',
      'delete_filter',
      'delete_label',
      'delete_message',
      'delete_thread',
      'send_draft',
      'send_message',
      'trash_message',
      'trash_thread',
      'unlabel_message',
      'unlabel_thread',
    ]);
  });

  it('marks exactly the sends as open-world', () => {
    const openWorld = Object.entries(operations)
      .filter(([, op]) => op.annotations?.openWorldHint)
      .map(([name]) => name)
      .sort();
    expect(openWorld).toEqual(['send_draft', 'send_message']);
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url)), 'utf8');
    expect(doc).toBe(
      renderCapabilities('Gmail capabilities', [
        { kind: 'MCP Tool', operations: tools },
        { kind: 'REST Method', operations: methods },
      ]),
    );
  });
});
