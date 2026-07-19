import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_embedded_object_border = sheetsOperation({
  description:
    'Set the border color of an embedded chart, image, or slicer by object ID; only the object border changes, while its position, content, and underlying cells remain untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateEmbeddedObjectBorderRequest',
  schema,
  handler,
});
