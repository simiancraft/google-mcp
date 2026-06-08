import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/list */
export const list_filters = operation({
  description: 'List all filters for the account.',
  schema,
  handler,
});
