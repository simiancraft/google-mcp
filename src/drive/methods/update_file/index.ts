import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_file = driveOperation({
  description:
    "Update a file's metadata with patch semantics: rename, star, recolor a folder, edit the " +
    'description, or move it between folders with addParents/removeParents. Only the fields ' +
    'populated in the request change. Trash and restore are trash_file and untrash_file; ' +
    'content updates are not exposed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update',
  schema,
  handler,
});
