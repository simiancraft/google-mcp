import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_comment = driveOperation({
  description: "Update a comment's content with patch semantics.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/update',
  schema,
  handler,
});
