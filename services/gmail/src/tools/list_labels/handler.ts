import { defineTool } from '../../defineTool.js';
import { projectLabel } from '../../lib/label.js';
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
    return { labels: (data.labels ?? []).map(projectLabel) };
  },
});
