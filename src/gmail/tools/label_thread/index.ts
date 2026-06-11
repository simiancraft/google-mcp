import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Adds labels to every message in a thread via `users.threads.modify`
 * (addLabelIds); confirms the applied labels.
 */
export const label_thread = gmailOperation({
  description: 'Add labels to a thread.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_thread',
  schema,
  handler,
});
