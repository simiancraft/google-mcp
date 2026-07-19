import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Filters combine as an OR across the list and may select multiple metadata
 * entries. The derived mask applies the same provided changes to every match;
 * a location is masked by its selected oneof field.
 */
export const update_developer_metadata = sheetsOperation({
  description:
    'Update the key, value, location, or visibility of every developer metadata entry matching any dataFilter; only provided fields change, and the reply lists every updated entry.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateDeveloperMetadataRequest',
  schema,
  handler,
});
