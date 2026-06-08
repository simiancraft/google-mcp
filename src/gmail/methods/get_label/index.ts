import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/get
 * `labels.get` (unlike `labels.list`) includes the color and thread counts.
 */
export const get_label = operation({
  description: 'Get a label by id (includes color and thread counts).',
  schema,
  handler,
});
