import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const search_files = driveOperation({
  description:
    'Search for Drive files with a structured query (`query_term operator values` clauses ' +
    'combined with and, or, not, and parentheses).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/search_files',
  schema,
  handler,
});
