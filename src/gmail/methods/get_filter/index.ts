import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/get */
export const get_filter = gmailOperation({
  description: 'Get a filter by id.',
  schema,
  handler,
});
