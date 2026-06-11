import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const create_file = driveOperation({
  description:
    'Create or upload a file to Drive. Supply text content as UTF-8 or base64-encode ' +
    'non-UTF8 data; text/plain converts to Google Docs and text/csv to Google Sheets unless ' +
    'disableConversionToGoogleType is set, and Google-native types (Docs, Sheets, Slides) ' +
    'can be created without content.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/create_file',
  schema,
  handler,
});
