import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_about = driveOperation({
  description:
    "Get information about the user and the user's Drive: identity, storage quota and " +
    'usage, the maximum upload size, and whether the user can create shared drives.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/rest/v3/about/get',
  schema,
  handler,
});
