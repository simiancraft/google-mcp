import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DataFilter may match multiple metadata entries. The deletion is not
 * recoverable through Sheets, but it removes only metadata and does not delete
 * the rows, columns, sheets, or cell values to which the metadata was attached.
 */
export const delete_developer_metadata = sheetsOperation({
  description:
    'Irreversibly delete every developer metadata entry matching one dataFilter and return the deleted entries; an empty developerMetadataLookup matches all metadata visible to the requesting project and deletes every visible entry, while attached rows, columns, sheets, and cell values are not deleted.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteDeveloperMetadataRequest',
  schema,
  handler,
});
