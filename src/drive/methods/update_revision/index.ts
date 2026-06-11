import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_revision = driveOperation({
  description:
    'Update a revision with patch semantics: pin it with keepForever (binary content) or ' +
    'manage the publish flags (Docs Editors files).',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/revisions/update',
  schema,
  handler,
});
