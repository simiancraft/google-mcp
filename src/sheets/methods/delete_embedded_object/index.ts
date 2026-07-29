import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Deletes any embedded object (chart, image, or slicer) by ID; chart and
 * slicer adds return the corresponding ID.
 */
export const delete_embedded_object = sheetsOperation({
  description:
    'Permanently delete an embedded chart, image, or slicer from a spreadsheet by its ID; underlying cells and source values are unchanged.',
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
