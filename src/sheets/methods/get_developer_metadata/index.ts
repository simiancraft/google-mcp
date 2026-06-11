import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_developer_metadata = sheetsOperation({
  description: 'Get one developer metadata entry by its spreadsheet-scoped id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata/get',
  schema,
  handler,
});
