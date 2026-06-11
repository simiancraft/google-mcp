import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const copy_file = driveOperation({
  description:
    'Copy an existing file in Drive, optionally with a new title and parent folder. With no ' +
    "title the copy is named 'Copy of [original title]'; with no parent it lands beside the " +
    "original, or in the user's root folder if write access is unavailable.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/copy_file',
  schema,
  handler,
});
