import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateTableColumnPropertiesRequest applied via `documents.batchUpdate`
 * (the curated subset; issue #35). Only the provided property fields change;
 * re-applying the same arguments yields the same properties, so the
 * operation is idempotent.
 */
export const update_table_column_properties = docsOperation({
  description:
    'Set column properties (evenly distributed or fixed width, and the fixed width in points) on specific table columns, or on every column when no indices are given; only the provided fields change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTableColumnPropertiesRequest',
  schema,
  handler,
});
