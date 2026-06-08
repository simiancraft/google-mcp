import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_drafts
 *
 * `users.drafts.list` returns id + message stubs; each draft is fetched `full`
 * so the projection can populate subject, recipients, and the body.
 */
export const list_drafts = operation({
  description: 'List draft messages, with optional Gmail query filtering.',
  schema,
  handler,
});
