import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Repeating an index-addressed move acts on the dimensions now at the source. */
export const move_dimension = sheetsOperation({
  description:
    'Move complete rows or columns to a destination index measured before removal; their data and properties move with them, surrounding dimensions shift to make room, and repeating the same index-addressed call can move different content.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#MoveDimensionRequest',
  schema,
  handler,
});
