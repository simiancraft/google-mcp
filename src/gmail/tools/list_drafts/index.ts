import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_drafts
 *
 * `users.drafts.list` returns id + message stubs; each draft is fetched `full`
 * so the projection can populate subject, recipients, and the body.
 */
export const list_drafts = gmailOperation({
  description: 'List draft messages, with optional Gmail query filtering.',
  // Deviation: Google's page marks all four hints false, contradicting its
  // sibling list operations (list_labels, search_threads are read-only); a
  // list cannot modify the account, so this transcribes the corrected values.
  // See COVERAGE.md.
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
