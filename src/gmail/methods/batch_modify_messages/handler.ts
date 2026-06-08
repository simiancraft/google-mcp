import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await gmail.users.messages.batchModify({
    userId: 'me',
    requestBody: {
      ids: args.messageIds,
      addLabelIds: args.addLabelIds,
      removeLabelIds: args.removeLabelIds,
    },
  });
  return {
    messageIds: args.messageIds,
    addLabelIds: args.addLabelIds,
    removeLabelIds: args.removeLabelIds,
  };
}
