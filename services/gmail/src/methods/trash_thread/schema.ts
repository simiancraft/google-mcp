import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/trash */
export const input = z.object({
  threadId: z.string().describe('The id of the thread to move to the trash.'),
});

export const output = Thread;
