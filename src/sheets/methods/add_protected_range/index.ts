import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Destructive under the rubric's standing-side-effect cluster (the
 * `create_filter` precedent): the protection keeps restricting every
 * collaborator not granted access, so it is not merely additive. Existing
 * protected ranges are listed per sheet by `get_spreadsheet`, each with the
 * ID that `update_protected_range` and `delete_protected_range` take. The
 * REST entity's tableId backing is not carried (tables are not part of this
 * surface).
 */
export const add_protected_range = sheetsOperation({
  description:
    'Protect a range, a named range, or a whole sheet so only the granted editors (listed users and groups, or the whole domain with domainUsersCanEdit) can change it, or (with warningOnly) so every edit prompts a confirmation warning; returns the protected range with its assigned ID.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddProtectedRangeRequest',
  schema,
  handler,
});
