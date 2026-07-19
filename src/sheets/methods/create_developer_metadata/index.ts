import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Repeating without a caller-assigned ID creates another metadata entry, so
 * this additive operation is not idempotent. DOCUMENT visibility exposes the
 * entry to any developer project with document access; PROJECT limits it to
 * the creating project.
 */
export const create_developer_metadata = sheetsOperation({
  description:
    'Attach developer metadata to a spreadsheet, sheet, row, or column and return it with its assigned ID; the association follows rows and columns as they move, and DOCUMENT visibility exposes it to any developer project with document access.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#CreateDeveloperMetadataRequest',
  schema,
  handler,
});
