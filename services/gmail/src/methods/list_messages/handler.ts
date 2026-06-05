import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
 * Lists message stubs, then fetches each with `metadata` format (headers +
 * snippet) for the projection. Use get_message for a full body.
 */
export const list_messages = defineMethod({
  description: 'List messages using Gmail query syntax.',
  input,
  output,
  handler: async (gmail, args) => {
    const list = await gmail.users.messages.list({
      userId: 'me',
      q: args.query,
      maxResults: args.pageSize ?? 20,
      pageToken: args.pageToken,
      includeSpamTrash: args.includeTrash ?? false,
    });

    const stubs = list.data.messages ?? [];
    const messages = await Promise.all(
      stubs.map(async (stub) => {
        const { data } = await gmail.users.messages.get({
          userId: 'me',
          id: stub.id ?? undefined,
          format: 'metadata',
        });
        return projectMessage(data);
      }),
    );

    return { messages, nextPageToken: list.data.nextPageToken ?? undefined };
  },
});
