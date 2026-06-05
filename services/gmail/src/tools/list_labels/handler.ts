import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_labels
 *
 * The REST `users.labels.list` returns every label in one call (no paging) with
 * basic fields; `color` and the thread counts are populated only when present.
 * The projection renames `id` -> `labelId` to match the documented shape.
 */
export const list_labels = defineTool({
  description: 'List the labels in the mailbox.',
  input,
  output,
  handler: async (gmail) => {
    const { data } = await gmail.users.labels.list({ userId: 'me' });
    const labels = (data.labels ?? []).map((label) => ({
      labelId: label.id ?? '',
      name: label.name ?? '',
      color: label.color
        ? {
            textColor: label.color.textColor ?? '',
            backgroundColor: label.color.backgroundColor ?? '',
          }
        : undefined,
      threadsTotal: label.threadsTotal ?? undefined,
      threadsUnread: label.threadsUnread ?? undefined,
    }));
    return { labels };
  },
});
