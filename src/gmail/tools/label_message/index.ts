import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_message
 * Adds labels via `users.messages.modify` (addLabelIds); confirms the applied
 * labels. (Matches `label_thread`, whose thread response carries no single label
 * set, so both tools report the labels acted on rather than the resulting state.)
 */
export const label_message = gmailOperation({
  description: 'Add labels to a message.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
