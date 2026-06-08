import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_labels
 *
 * The REST `users.labels.list` returns every label in one call (no paging) with
 * basic fields; `color` and the thread counts are populated only when present.
 * The projection renames `id` -> `labelId` to match the documented shape.
 */
export const list_labels = operation({
  description: 'List the labels in the mailbox.',
  schema,
  handler,
});
