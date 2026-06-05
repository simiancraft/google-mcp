import { defineTool } from '../../defineTool.js';
import { buildRawMessage, projectDraft } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_draft
 *
 * Assembles an RFC 822 message and creates a draft. When `replyToMessageId` is
 * given, the original is fetched for its thread and Message-ID so the draft
 * threads correctly. The created draft is re-fetched `full` for projection.
 */
export const create_draft = defineTool({
  description: 'Create a draft email.',
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
  },
});
