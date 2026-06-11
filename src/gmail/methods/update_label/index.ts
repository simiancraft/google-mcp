import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Patches name and/or color of a user label.
 */
export const update_label = gmailOperation({
  description: 'Update a label name and/or color.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/patch',
  schema,
  handler,
});
