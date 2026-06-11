import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_shared_drive = driveOperation({
  description:
    'Permanently delete a shared drive for which the user is an organizer. The shared drive ' +
    'cannot contain any untrashed items.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/drives/delete',
  schema,
  handler,
});
