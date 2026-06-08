import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { buildRawMessage, projectDraft } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  let threadId: string | undefined;
  let inReplyTo: string | undefined;

  if (args.replyToMessageId) {
    const { data } = await gmail.users.messages.get({
      userId: 'me',
      id: args.replyToMessageId,
      format: 'metadata',
      metadataHeaders: ['Message-ID'],
    });
    threadId = data.threadId ?? undefined;
    inReplyTo =
      data.payload?.headers?.find((header) => header.name?.toLowerCase() === 'message-id')?.value ??
      undefined;
  }

  const raw = buildRawMessage({
    from: await senderAddress(gmail),
    to: args.to,
    cc: args.cc,
    bcc: args.bcc,
    subject: args.subject,
    body: args.body,
    htmlBody: args.htmlBody,
    inReplyTo,
  });

  const created = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: { message: { raw, threadId } },
  });

  const { data } = await gmail.users.drafts.get({
    userId: 'me',
    id: created.data.id ?? undefined,
    format: 'full',
  });
  return projectDraft(data);
}
