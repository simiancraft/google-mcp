import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_thread */
export const input = z.object({
  threadId: z.string().describe('The id of the thread to add the labels to.'),
  labelIds: z.array(z.string()).describe('The ids of the labels to add.'),
});

/** The MCP reference documents no output body; we confirm the applied labels. */
export const output = z.object({
  threadId: z.string(),
  labelIds: z.array(z.string()),
});
