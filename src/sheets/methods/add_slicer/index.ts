import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * A slicer is an additive sheet-level object but its active criteria can alter
 * which source data charts display and, by default, apply to pivot tables. It
 * does not modify source cell values. Replaying without an ID creates another
 * slicer, so the operation is not idempotent.
 */
export const add_slicer = sheetsOperation({
  description:
    'Add a slicer floating on an existing sheet and return it with its assigned ID; its criteria can change what charts and, by default, pivot tables display, but source cell values are not modified.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddSlicerRequest',
  schema,
  handler,
});
