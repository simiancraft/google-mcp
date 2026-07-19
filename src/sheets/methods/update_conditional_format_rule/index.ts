import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The REST request is a oneof of two instructions, replace (rule) and move
 * (newIndex); they differ in required fields (a move needs sheetId) and in
 * idempotency (a move is index-relative), so the page ships as this
 * operation and `move_conditional_format_rule`, the same split Drive's
 * files/update page gets. The whole rule is replaced, as the REST request
 * replaces it; there is no field mask on this request.
 */
export const update_conditional_format_rule = sheetsOperation({
  description:
    'Replace the conditional format rule at an index with a new rule; the whole rule is replaced, so send the complete rule, and use move_conditional_format_rule to reorder instead.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateConditionalFormatRuleRequest',
  schema,
  handler,
});
