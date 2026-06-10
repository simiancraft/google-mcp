import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.messages.modify({
    userId: 'me',
    id: args.messageId,
    requestBody: { removeLabelIds: args.labelIds },
  });
  return { messageId: data.id ?? args.messageId, labelIds: args.labelIds };
}
