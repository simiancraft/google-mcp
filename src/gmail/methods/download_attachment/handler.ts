import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { MAX_DOWNLOAD_BYTES } from '../../../lib/consts.js';
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
  // The same ceiling Drive's content tools enforce; Gmail's own attachment
  // maximum sits at the boundary, so this is symmetry, not a new policy.
  const size = data.size ?? 0;
  if (size > MAX_DOWNLOAD_BYTES) {
    throw new Error(
      `Attachment is ${size} bytes; this server caps base64 transfers at ${MAX_DOWNLOAD_BYTES} bytes (25 MiB).`,
    );
  }
  return {
    attachmentId: args.attachmentId,
    size,
    data: data.data ?? '',
  };
}
