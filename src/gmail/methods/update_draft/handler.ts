import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { buildRawMessage, projectDraft } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const raw = buildRawMessage({
    from: await senderAddress(gmail),
    to: args.to,
    cc: args.cc,
    bcc: args.bcc,
    subject: args.subject,
    body: args.body,
    htmlBody: args.htmlBody,
  });
  await gmail.users.drafts.update({
    userId: 'me',
    id: args.draftId,
    requestBody: { message: { raw } },
  });
  const { data } = await gmail.users.drafts.get({
    userId: 'me',
    id: args.draftId,
    format: 'full',
  });
  return projectDraft(data);
}
