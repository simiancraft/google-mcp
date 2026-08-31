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
    counts: { methods: 35 },
    readOnly: ['get_document'],
    destructive: [
      'delete_content_range',
      'delete_footer',
      'delete_header',
      'delete_named_range',
      'delete_paragraph_bullets',
      'delete_positioned_object',
      'delete_table_column',
      'delete_table_row',
      'merge_table_cells',
      'replace_all_text',
      'replace_image',
      'replace_named_range_content',
      'unmerge_table_cells',
    ],
    openWorld: ['insert_inline_image', 'replace_image'],
    nonIdempotent: [
      'create_document',
      'create_footer',
      'create_footnote',
      'create_header',
      'create_named_range',
      'delete_content_range',
      'delete_table_column',
      'delete_table_row',
      'insert_inline_image',
      'insert_page_break',
      'insert_section_break',
      'insert_table',
      'insert_table_column',
      'insert_table_row',
      'insert_text',
      'replace_all_text',
    ],
  });
});
