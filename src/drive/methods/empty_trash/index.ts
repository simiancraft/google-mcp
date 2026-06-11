import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const empty_trash = driveOperation({
  description:
    "Permanently delete all of the user's trashed files (or, with driveId, a shared " +
    "drive's trash). Nothing emptied from the trash can be restored.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/files/emptyTrash',
  schema,
  handler,
});
