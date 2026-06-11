import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/delete
 * Deletes a user label and removes it from all messages and threads. Not marked
 * destructive: no mail is lost, and the label is recreatable.
 */
export const delete_label = gmailOperation({
  description: 'Delete a user label.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
