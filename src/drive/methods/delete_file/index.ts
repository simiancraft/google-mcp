import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_file = driveOperation({
  description:
    'Permanently delete a file owned by the user without moving it to the trash; if the ' +
    'target is a folder, all descendants owned by the user are also deleted. For the ' +
    'reversible path, use trash_file. In a shared drive the user must be an organizer on ' +
    'the parent folder.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/files/delete',
  schema,
  handler,
});
