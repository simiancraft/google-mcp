import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_revision = driveOperation({
  description:
    'Permanently delete a file version. Only revisions of files with binary content (like ' +
    'images or videos) can be deleted; Docs Editors revisions and the last remaining ' +
    'version cannot.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/revisions/delete',
  schema,
  handler,
});
