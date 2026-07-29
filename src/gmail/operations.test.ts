import { describe } from 'bun:test';
import { pinOperationSurface } from '../lib/testing/surface-pins.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

describe('gmail operations', () => {
  pinOperationSurface({
    moduleUrl: import.meta.url,
    capabilitiesTitle: 'Gmail capabilities',
    instructions,
    groups: [
      { kind: 'MCP Tool', operations: tools },
      { kind: 'REST Method', operations: methods },
    ],
    toolSourcePrefix: 'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/',
    methodSourcePrefix: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/',
    counts: { tools: 10, methods: 23 },
    readOnly: [
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
    ],
    destructive: [
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
    ],
    openWorld: ['send_draft', 'send_message'],
    nonIdempotent: ['create_draft', 'create_filter', 'create_label', 'send_draft', 'send_message'],
  });
});
