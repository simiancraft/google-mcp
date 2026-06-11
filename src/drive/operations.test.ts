import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations, SOURCE_META_KEY } from '../lib/operation.js';
import { renderCapabilities } from '../lib/server.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

const operations = mergeOperations(tools, methods);

describe('drive operations', () => {
  it('exposes the full surface (8 tools, 15 methods)', () => {
    expect(Object.keys(tools)).toHaveLength(8);
    expect(Object.keys(methods)).toHaveLength(15);
    expect(Object.keys(operations)).toHaveLength(23);
  });

  it('every operation has a description, a schema, and a handler', () => {
    for (const op of Object.values(operations)) {
      expect(op.description.length).toBeGreaterThan(0);
      expect(op.schema.input).toBeDefined();
      expect(op.schema.output).toBeDefined();
      expect(typeof op.handler).toBe('function');
    }
  });

  it('instructions cite the real _meta key and only real operation names', () => {
    expect(instructions).toContain(SOURCE_META_KEY);
    const mentioned = instructions.match(/\b[a-z]+(?:_[a-z]+)+\b/g) ?? [];
    for (const name of mentioned) {
      expect(operations).toHaveProperty(name);
    }
  });

  it('cites the matching reference page on every operation', () => {
    for (const [name, op] of Object.entries(tools)) {
      expect(op.source).toMatch(
        new RegExp(`^https://developers\\.google\\.com/.+/mcp/tools_list/${name}$`),
      );
    }
    for (const op of Object.values(methods)) {
      expect(op.source).toMatch(/^https:\/\/developers\.google\.com\/.+\/reference\/rest\/v3\//);
      expect(op.source).not.toContain('mcp/tools_list');
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
      'download_file_content',
      'get_comment',
      'get_file_metadata',
      'get_file_permissions',
      'get_reply',
      'list_comments',
      'list_recent_files',
      'list_replies',
      'read_file_content',
      'search_files',
    ]);
  });

  it('marks exactly the destructive operations (deletes, trash, empty trash)', () => {
    const destructive = Object.entries(operations)
      .filter(([, op]) => op.annotations?.destructiveHint)
      .map(([name]) => name)
      .sort();
    expect(destructive).toEqual([
      'delete_comment',
      'delete_file',
      'delete_reply',
      'empty_trash',
      'trash_file',
    ]);
  });

  it('marks exactly the open-world operations (the toolset-published pair)', () => {
    const openWorld = Object.entries(operations)
      .filter(([, op]) => op.annotations?.openWorldHint)
      .map(([name]) => name)
      .sort();
    expect(openWorld).toEqual(['copy_file', 'create_file']);
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url)), 'utf8');
    expect(doc).toBe(
      renderCapabilities('Drive capabilities', [
        { kind: 'MCP Tool', operations: tools },
        { kind: 'REST Method', operations: methods },
      ]),
    );
  });
});
