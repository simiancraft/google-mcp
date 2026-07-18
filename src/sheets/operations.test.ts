import { describe } from 'bun:test';
import { pinOperationSurface } from '../lib/testing/surface-pins.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';

describe('sheets operations', () => {
  pinOperationSurface({
    moduleUrl: import.meta.url,
    capabilitiesTitle: 'Sheets capabilities',
    instructions,
    groups: [{ kind: 'REST Method', operations: methods }],
    methodSourcePrefix: 'https://developers.google.com/workspace/sheets/api/reference/rest/v4/',
    counts: { methods: 30 },
    readOnly: [
      'batch_get_values',
      'batch_get_values_by_data_filter',
      'get_developer_metadata',
      'get_spreadsheet',
      'get_values',
      'search_developer_metadata',
    ],
    destructive: [
      'batch_clear_values',
      'batch_clear_values_by_data_filter',
      'clear_values',
      'delete_dimension',
      'delete_embedded_object',
      'delete_named_range',
      'delete_sheet',
    ],
    openWorld: [],
  });
});
