import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_label
 *
 * Creates a user label via `users.labels.create` and projects the result
 * (id -> labelId). `displayName` maps to the REST `name`.
 */
export const create_label = gmailOperation({
  description: 'Create a new label.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
