import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Not idempotent, unlike the suite's id-addressed removals: the range is
 * index-addressed, so repeating the call deletes whatever shifted into it.
 */
export const delete_dimension = sheetsOperation({
  description:
    'Permanently delete rows or columns from a sheet, including their data; later rows or columns shift into the deleted range.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteDimensionRequest',
  schema,
  handler,
});
