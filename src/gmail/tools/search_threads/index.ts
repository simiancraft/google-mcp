import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One `users.threads.list` call: returns thread ids and the snippet the list
 * response already carries, with no per-thread fetch. Use `get_thread(id)` to
 * hydrate a thread's full messages on demand.
 */
export const search_threads = gmailOperation({
  description: 'Search threads. Returns thread ids and snippets; use get_thread for messages.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/search_threads',
  schema,
  handler,
});
