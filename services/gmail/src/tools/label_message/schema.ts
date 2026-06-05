import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_message */
export const input = z.object({
  messageId: z.string().describe('The id of the message to add the labels to.'),
  labelIds: z.array(z.string()).describe('The ids of the labels to add.'),
});

/** The MCP reference documents no output body; we return the resulting state. */
export const output = z.object({
  messageId: z.string(),
  labelIds: z.array(z.string()),
});
