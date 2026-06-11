import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const list_revisions = driveOperation({
  description:
    "List a file's revisions, newest last. The list might be incomplete for files with a " +
    'large revision history (frequently edited Docs, Sheets, and Slides).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/revisions/list',
  schema,
  handler,
});
