import { defineMethod } from '../../defineMethod.js';
import { buildRawMessage, projectMessage } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
 *
 * Irreversible: assembles an RFC 822 message and sends it immediately. When
 * `replyToMessageId` is given, the original is fetched for its thread and
 * Message-ID so the reply threads correctly.
 */
export const send_message = defineMethod({
  description: 'Send an email immediately.',
  destructive: true,
  input,
  output,
  handler: async (gmail, args) => {
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
        data.payload?.headers?.find((header) => header.name?.toLowerCase() === 'message-id')
          ?.value ?? undefined;
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

    const { data } = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw, threadId },
    });
    return projectMessage(data);
  },
});
