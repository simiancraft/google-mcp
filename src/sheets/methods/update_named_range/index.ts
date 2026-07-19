import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The mask is derived from the provided name and range coordinates. Renaming
 * updates formulas that reference the named range; retargeting changes the
 * cells those formulas read without rewriting their source.
 */
export const update_named_range = sheetsOperation({
  description:
    'Rename or retarget a named range by ID behind a derived field mask; renaming updates every formula that references the name, while retargeting changes the cells those formulas calculate from.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateNamedRangeRequest',
  schema,
  handler,
});
