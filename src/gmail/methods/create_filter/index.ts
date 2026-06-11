import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/create */
export const create_filter = gmailOperation({
  description: 'Create a filter (criteria plus actions).',
  // A filter is a persistent side effect: a forward/auto-delete/auto-archive
  // action keeps acting on mail after the call, so it is destructive even though
  // delete_filter can undo it.
  destructive: true,
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
