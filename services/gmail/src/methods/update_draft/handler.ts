import { defineMethod } from '../../defineMethod.js';
import { buildRawMessage, projectDraft } from '../../lib/message.js';
import { senderAddress } from '../../lib/profile.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/update
 * Replaces the draft's content with a freshly assembled message, then re-fetches
 * it `full` for projection.
 */
export const update_draft = defineMethod({
  description: 'Replace the content of an existing draft.',
  input,
  output,
  handler: async (gmail, args) => {
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
  },
});
