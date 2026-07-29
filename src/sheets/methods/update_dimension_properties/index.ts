import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** The mask is derived from the provided properties, including false and zero; the output echoes the exact range and values. */
export const update_dimension_properties = sheetsOperation({
  description:
    'Set exact row heights or column widths in pixels, or explicitly hide or reveal rows or columns; only the provided properties change across the selected dimensions, and cell content is untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateDimensionPropertiesRequest',
  schema,
  handler,
});
