import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_shared_drive = driveOperation({
  description:
    "Update a shared drive's metadata with patch semantics: rename, retheme or recolor, or " +
    'set its restrictions.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/drives/update',
  schema,
  handler,
});
