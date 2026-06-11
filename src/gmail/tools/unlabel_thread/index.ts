import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Removes labels from every message in a thread via `users.threads.modify`
 * (removeLabelIds); confirms the removed labels.
 */
export const unlabel_thread = gmailOperation({
  description: 'Remove labels from a thread.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_thread',
  schema,
  handler,
});
