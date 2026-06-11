import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * MINIMAL maps to the REST `metadata` format (headers + snippet); FULL_CONTENT
 * (the default) maps to `full`, which carries the MIME tree projected to
 * plaintext bodies and attachment ids.
 */
export const get_thread = gmailOperation({
  description: 'Get a thread and its messages by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/get_thread',
  schema,
  handler,
});
