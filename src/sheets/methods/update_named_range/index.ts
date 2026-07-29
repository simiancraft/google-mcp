import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The mask is derived from the provided name and range coordinates. Renaming
 * updates syntactic cell and range references to the named range, but string
 * references such as INDIRECT("name") are not rewritten. Retargeting changes
 * the cells those syntactic references read without rewriting their source.
 */
export const update_named_range = sheetsOperation({
  description:
    'Rename or retarget a named range by ID behind a derived field mask; renaming updates syntactic cell and range references to the name but does not rewrite string references such as INDIRECT("name"), while retargeting changes the cells those syntactic references calculate from.',
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
