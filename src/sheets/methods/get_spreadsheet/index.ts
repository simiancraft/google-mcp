import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Metadata only by design: the projection carries identity, spreadsheet
 * properties, and per-sheet properties; grid data (per-cell formatting,
 * validation, notes) is not exposed (issue #28). Cell contents are read with
 * the values operations.
 */
export const get_spreadsheet = sheetsOperation({
  description:
    'Get a spreadsheet by id: its properties (title, locale, time zone) and the properties of every sheet (tab). Cell data is read with the values operations.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/get',
  schema,
  handler,
});
