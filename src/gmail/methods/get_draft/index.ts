import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_draft = gmailOperation({
  description: 'Get a draft by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/get',
  schema,
  handler,
});
