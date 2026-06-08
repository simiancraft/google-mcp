import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/untrash */
export const input = z.object({
  threadId: z.string().describe('The id of the thread to remove from the trash.'),
});

export const output = Thread;
