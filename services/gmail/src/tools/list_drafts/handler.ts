import { defineTool } from '../../defineTool.js';
import { projectDraft } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_drafts
 *
 * `users.drafts.list` returns id + message stubs; each draft is fetched `full`
 * so the projection can populate subject, recipients, and the body.
 */
export const list_drafts = defineTool({
  description: 'List draft messages, with optional Gmail query filtering.',
  input,
  output,
  handler: async (gmail, args) => {
    const list = await gmail.users.drafts.list({
      userId: 'me',
      q: args.query,
      maxResults: args.pageSize ?? 10,
      pageToken: args.pageToken,
    });

    const stubs = list.data.drafts ?? [];
    const drafts = await Promise.all(
      stubs.map(async (stub) => {
        const { data } = await gmail.users.drafts.get({
          userId: 'me',
          id: stub.id ?? undefined,
          format: 'full',
        });
        return projectDraft(data);
      }),
    );

    return { drafts, nextPageToken: list.data.nextPageToken ?? undefined };
  },
});
