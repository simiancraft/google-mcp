import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { projectMessage } from '../../lib/message.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.messages.untrash({ userId: 'me', id: args.messageId });
  return projectMessage(data);
}
