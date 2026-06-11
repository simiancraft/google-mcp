import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const create_shared_drive = driveOperation({
  description:
    'Create a shared drive. Requires a Google Workspace edition that supports shared drives.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/drives/create',
  schema,
  handler,
});
