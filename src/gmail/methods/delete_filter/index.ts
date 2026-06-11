import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Deletes a filter. No mail is lost and a filter is recreatable; annotated
 * destructive as a removal.
 */
export const delete_filter = gmailOperation({
  description: 'Delete a filter.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/delete',
  schema,
  handler,
});
