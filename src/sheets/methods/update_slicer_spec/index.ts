import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The REST request has a field mask, so this operation updates only provided
 * spec fields. Structured ranges, criteria, and text formats expand per
 * provided subkey. It does not move or resize the slicer; that is the separate
 * embedded-object position request.
 */
export const update_slicer_spec = sheetsOperation({
  description:
    'Update selected slicer spec fields by ID behind a derived mask; criteria changes can alter what charts and pivot tables display, source cells are unchanged, and the slicer is not moved or resized.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateSlicerSpecRequest',
  schema,
  handler,
});
