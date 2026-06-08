import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_draft
 *
 * Assembles an RFC 822 message and creates a draft. When `replyToMessageId` is
 * given, the original is fetched for its thread and Message-ID so the draft
 * threads correctly. The created draft is re-fetched `full` for projection.
 */
export const create_draft = operation({
  description: 'Create a draft email.',
  schema,
  handler,
});
