import { z } from 'zod';
import { Message } from './Message.js';

/** Source: object (Thread) on the Gmail MCP reference. A thread of messages. */
export const Thread = z.object({
  /** The unique identifier of the thread. */
  id: z.string(),
  /** The messages in the thread, chronologically ordered. */
  messages: z.array(Message).default([]),
});

export type Thread = z.infer<typeof Thread>;
