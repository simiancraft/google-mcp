import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The move half of UpdateConditionalFormatRuleRequest's oneof (see
 * `update_conditional_format_rule` for the split). Not idempotent: the rule
 * is addressed by index, so repeating the call moves whatever rule has since
 * shifted into that index, like `delete_dimension`.
 */
export const move_conditional_format_rule = sheetsOperation({
  description:
    'Move the conditional format rule at an index to a new index in its sheet, changing its precedence; earlier rules take precedence where rules overlap.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateConditionalFormatRuleRequest',
  schema,
  handler,
});
