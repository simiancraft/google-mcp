import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata/search */
export const search_developer_metadata = sheetsOperation({
  description:
    'Search developer metadata by lookup criteria or by spreadsheet location (A1 or grid range).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
