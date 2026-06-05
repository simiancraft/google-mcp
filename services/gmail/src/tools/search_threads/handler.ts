import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/search_threads
 *
 * One `users.threads.list` call: returns thread ids and the snippet the list
 * response already carries, with no per-thread fetch. Use `get_thread(id)` to
 * hydrate a thread's full messages on demand.
 */
export const search_threads = defineTool({
  description: 'Search threads. Returns thread ids and snippets; use get_thread for messages.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.threads.list({
      userId: 'me',
      q: args.query,
      maxResults: args.pageSize ?? 20,
      pageToken: args.pageToken,
      includeSpamTrash: args.includeTrash ?? false,
    });

    const threads = (data.threads ?? []).map((thread) => ({
      id: thread.id ?? '',
      snippet: thread.snippet ?? undefined,
      messages: [],
    }));

    return { threads, nextPageToken: data.nextPageToken ?? undefined };
  },
});
