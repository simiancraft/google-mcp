import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_comment = driveOperation({
  description: 'Delete a comment and its replies.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/delete',
  schema,
  handler,
});
