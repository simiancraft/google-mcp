import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const trash_file = driveOperation({
  description:
    'Move a file to the trash (files.update with trashed). Only the owner may trash a file; ' +
    'Drive purges trashed files after 30 days, and untrash_file restores them before that. ' +
    'delete_file bypasses the trash entirely.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update',
  schema,
  handler,
});
