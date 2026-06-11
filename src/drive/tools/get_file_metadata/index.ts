import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_file_metadata = driveOperation({
  description:
    "Retrieve general metadata about a user's Drive file. If the file cannot be located, " +
    'use search_files to help identify the requested file.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/get_file_metadata',
  schema,
  handler,
});
