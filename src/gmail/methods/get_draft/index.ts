import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/get */
export const get_draft = gmailOperation({
  description: 'Get a draft by id.',
  schema,
  handler,
});
