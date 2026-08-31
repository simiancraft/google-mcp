import { describe } from 'bun:test';
import { pinOperationSurface } from '../lib/testing/surface-pins.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';

describe('docs operations', () => {
  pinOperationSurface({
    moduleUrl: import.meta.url,
    capabilitiesTitle: 'Docs capabilities',
    instructions,
    groups: [{ kind: 'REST Method', operations: methods }],
    methodSourcePrefix: 'https://developers.google.com/workspace/docs/api/reference/rest/v1/',
    counts: { methods: 17 },
    readOnly: ['get_document'],
    destructive: [
      'delete_content_range',
      'delete_paragraph_bullets',
      'delete_table_column',
      'delete_table_row',
      'replace_all_text',
    ],
    openWorld: [],
    nonIdempotent: [
      'create_document',
      'delete_content_range',
      'delete_table_column',
      'delete_table_row',
      'insert_section_break',
      'insert_table',
      'insert_table_column',
      'insert_table_row',
      'insert_text',
      'replace_all_text',
    ],
  });
});
