import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const download_file_content = driveOperation({
  description:
    'Download the content of a Drive file as a base64 encoded string. For Google Drive ' +
    'native file types, exportMimeType determines the output format (default text). For a ' +
    'natural language representation of Drive content, prefer read_file_content; if a file ' +
    'is not found, use search_files.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/download_file_content',
  schema,
  handler,
});
