import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const list_recent_files = driveOperation({
  description:
    'Find recent files for a user with a specified sort order (default recency, page size 10).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/list_recent_files',
  schema,
  handler,
});
