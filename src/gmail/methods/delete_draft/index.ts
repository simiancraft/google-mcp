import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/delete
 * Deletes a draft. A draft is unsent and recreatable; annotated destructive
 * as a removal.
 */
export const delete_draft = gmailOperation({
  description: 'Delete a draft.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
