import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** The field mask is derived from the supplied OverlayPosition fields. */
export const update_embedded_object_position = sheetsOperation({
  description:
    'Move or resize an embedded chart, image, or slicer by object ID, or move it to a new object sheet with an explicit or generated ID; overlay updates change only the provided anchor, offsets, width, or height, and cells beneath the object are untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateEmbeddedObjectPositionRequest',
  schema,
  handler,
});
