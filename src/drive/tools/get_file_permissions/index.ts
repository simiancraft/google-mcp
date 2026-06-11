import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_file_permissions = driveOperation({
  description: 'List the permissions of a Drive file.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/get_file_permissions',
  schema,
  handler,
});
