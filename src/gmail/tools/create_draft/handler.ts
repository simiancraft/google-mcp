import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { buildRawMessage, projectDraft, resolveReplyContext } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { threadId, inReplyTo } = await resolveReplyContext(gmail, args.replyToMessageId);

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
