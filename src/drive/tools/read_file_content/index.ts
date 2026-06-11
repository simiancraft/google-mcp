import { driveOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const read_file_content = driveOperation({
  description:
    'Fetch a natural language representation of a Drive file: Google Docs, Sheets, and ' +
    'Slides export as text, and text-like files (text, JSON, XML, SVG) return as UTF-8. ' +
    'Other types need download_file_content. If a file is not found, use search_files ' +
    'to locate it by keywords.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/read_file_content',
  schema,
  handler,
});
