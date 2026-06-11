import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { assertWithinDownloadCap } from '../../../lib/limits.js';
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
  assertWithinDownloadCap(size, { subject: 'Attachment', action: 'base64 transfers' });
  return {
    attachmentId: args.attachmentId,
    size,
    data: data.data ?? '',
  };
}
