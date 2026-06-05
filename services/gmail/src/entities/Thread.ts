import { z } from 'zod';
import { Message } from './Message.js';

/**
 * A collection of related messages forming a conversation. In an email client,
 * a thread is formed when one or more recipients respond to a message with their
 * own message.
 *
 * Fields here are the MCP-projected shape of the REST `threads` resource.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Thread = z.object({
  /** The unique identifier of the thread. */
  id: z.string(),
  /** The messages in the thread, chronologically ordered. */
  messages: z.array(Message).default([]),
});

export type Thread = z.infer<typeof Thread>;
