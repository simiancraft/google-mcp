import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
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
  const base64url = data.data ?? '';

  // Disk path: decode and write the bytes, returning the path instead of a
  // large base64 string, so a caller can persist an attachment without
  // buffering it through the conversation as text.
  if (args.savePath !== undefined) {
    const bytes = Buffer.from(base64url, 'base64url');
    await mkdir(dirname(args.savePath), { recursive: true });
    await writeFile(args.savePath, bytes);
    return {
      attachmentId: args.attachmentId,
      size: bytes.byteLength,
      path: args.savePath,
    };
  }

  return {
    attachmentId: args.attachmentId,
    size,
    data: base64url,
  };
}
