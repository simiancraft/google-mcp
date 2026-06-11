import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * `labels.get` (unlike `labels.list`) includes the color and thread counts.
 */
export const get_label = gmailOperation({
  description: 'Get a label by id (includes color and thread counts).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/get',
  schema,
  handler,
});
