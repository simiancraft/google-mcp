import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const untrash_file = driveOperation({
  description:
    'Restore a file from the trash (files.update with trashed false), the reversible pair of ' +
    'trash_file. Files already purged from the trash cannot be restored.',
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
