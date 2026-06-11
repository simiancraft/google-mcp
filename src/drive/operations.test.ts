import { describe } from 'bun:test';
import { pinOperationSurface } from '../lib/testing/surface-pins.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

describe('drive operations', () => {
  pinOperationSurface({
    moduleUrl: import.meta.url,
    capabilitiesTitle: 'Drive capabilities',
    instructions,
    groups: [
      { kind: 'MCP Tool', operations: tools },
      { kind: 'REST Method', operations: methods },
    ],
    toolSourcePrefix: 'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/',
    methodSourcePrefix: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/',
    counts: { tools: 8, methods: 27 },
    readOnly: [
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
    ],
    destructive: [
      'delete_comment',
      'delete_file',
      'delete_reply',
      'delete_revision',
      'delete_shared_drive',
      'empty_trash',
      'trash_file',
    ],
    openWorld: ['copy_file', 'create_file'],
  });
});
