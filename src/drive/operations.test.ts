import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations, SOURCE_META_KEY } from '../lib/operation.js';
import { renderCapabilities, toolDefinitions } from '../lib/server.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

const operations = mergeOperations(tools, methods);

describe('drive operations', () => {
  it('exposes the full surface (8 tools, 27 methods)', () => {
    expect(Object.keys(tools)).toHaveLength(8);
    expect(Object.keys(methods)).toHaveLength(27);
    expect(Object.keys(operations)).toHaveLength(35);
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

  it('cites the matching reference page on every operation', () => {
    for (const [name, op] of Object.entries(tools)) {
      expect(op.source).toMatch(
        new RegExp(
          `^https://developers\\.google\\.com/workspace/drive/api/reference/mcp/tools_list/${name}$`,
        ),
      );
    }
    for (const op of Object.values(methods)) {
      expect(op.source).toMatch(
        /^https:\/\/developers\.google\.com\/workspace\/drive\/api\/reference\/rest\/v3\//,
      );
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
      'get_about',
      'get_comment',
      'get_file_metadata',
      'get_file_permissions',
      'get_reply',
      'get_revision',
      'get_shared_drive',
      'list_comments',
      'list_recent_files',
      'list_replies',
      'list_revisions',
      'list_shared_drives',
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
      'delete_revision',
      'delete_shared_drive',
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
