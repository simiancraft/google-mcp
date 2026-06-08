import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list */
export const input = z.object({
  query: z.string().optional(),
  /** Each result is hydrated with one fetch; bounded to keep the call count sensible. */
  pageSize: z.number().int().max(25).optional(),
  pageToken: z.string().optional(),
  includeTrash: z.boolean().optional(),
});

export const output = z.object({
  messages: z.array(Message),
  nextPageToken: z.string().optional(),
});
