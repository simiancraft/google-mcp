import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/delete
 * Deletes a filter. Not marked destructive: no mail is lost and a filter is recreatable.
 */
export const delete_filter = operation({
  description: 'Delete a filter.',
  schema,
  handler,
});
