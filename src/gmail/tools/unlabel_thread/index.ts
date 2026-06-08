import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_thread
 * Removes labels from every message in a thread via `users.threads.modify`
 * (removeLabelIds); confirms the removed labels.
 */
export const unlabel_thread = operation({
  description: 'Remove labels from a thread.',
  schema,
  handler,
});
