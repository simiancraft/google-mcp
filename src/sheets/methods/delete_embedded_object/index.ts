import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Deletes any embedded object (chart or image) by ID; with charts, the ID is
 * the one add_chart returned.
 */
export const delete_embedded_object = sheetsOperation({
  description:
    'Permanently delete an embedded object (a chart or image) from a spreadsheet by its ID.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteEmbeddedObjectRequest',
  schema,
  handler,
});
