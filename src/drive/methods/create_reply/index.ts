import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const create_reply = driveOperation({
  description:
    'Reply to a comment, optionally resolving or reopening it with the action field ' +
    '(content is required when no action is specified).',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/create',
  schema,
  handler,
});
