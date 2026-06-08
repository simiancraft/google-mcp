import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: args.messageId,
    id: args.attachmentId,
  });
  return {
    attachmentId: args.attachmentId,
    size: data.size ?? 0,
    data: data.data ?? '',
  };
}
