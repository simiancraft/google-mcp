import { defineTool } from '../../defineTool.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/search_threads
 *
 * `users.threads.list` returns thread stubs; each thread is fetched with
 * `metadata` format (headers + snippet, no bodies) to keep search cheap. Use
 * `get_thread` for full bodies and attachments.
 */
export const search_threads = defineTool({
  description: 'Search threads using Gmail query syntax.',
  input,
  output,
  handler: async (gmail, args) => {
    const list = await gmail.users.threads.list({
      userId: 'me',
      q: args.query,
      maxResults: args.pageSize ?? 20,
      pageToken: args.pageToken,
      includeSpamTrash: args.includeTrash ?? false,
    });

    const stubs = list.data.threads ?? [];
    const threads = await Promise.all(
      stubs.map(async (stub) => {
        const { data } = await gmail.users.threads.get({
          userId: 'me',
          id: stub.id ?? undefined,
          format: 'metadata',
        });
        return {
          id: data.id ?? stub.id ?? '',
          messages: (data.messages ?? []).map(projectMessage),
        };
      }),
    );

    return {
      threads,
      nextPageToken: list.data.nextPageToken ?? undefined,
    };
  },
});
