import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/get_thread */
export const input = z.object({
  threadId: z.string(),
  messageFormat: z.enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT']).optional(),
});

export const output = Thread;
