import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_message */
export const input = z.object({
  messageId: z.string().describe('The id of the message to remove the labels from.'),
  labelIds: z.array(z.string()).describe('The ids of the labels to remove.'),
});

/** The MCP reference documents no output body; we return the resulting state. */
export const output = z.object({
  messageId: z.string(),
  labelIds: z.array(z.string()),
});
