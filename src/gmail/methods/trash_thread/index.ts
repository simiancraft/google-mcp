import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/trash
 * Reversible: moves every message in a thread to the trash (undo with untrash_thread).
 */
export const trash_thread = gmailOperation({
  description: 'Move a thread to the trash.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
