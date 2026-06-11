import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Removes labels via `users.messages.modify` (removeLabelIds); confirms the
 * removed labels. (Matches `unlabel_thread`, whose thread response carries no
 * single label set, so both tools report the labels acted on.)
 */
export const unlabel_message = gmailOperation({
  description: 'Remove labels from a message.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_message',
  schema,
  handler,
});
