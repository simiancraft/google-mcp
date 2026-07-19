import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One group is updated per call, so the wire name is singular like its
 * siblings and matches the REST request UpdateDimensionGroupRequest. The
 * request carries the exact `dimensionGroup` selector plus a `collapsed`
 * field mask.
 */
export const update_dimension_group = sheetsOperation({
  description:
    'Collapse or expand a dimension group selected by its range and depth; collapsing hides every row or column in the group, expanding reveals every row or column in it, and independently hidden dimensions are therefore changed too.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateDimensionGroupRequest',
  schema,
  handler,
});
