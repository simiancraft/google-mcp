import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Not idempotent: rules are addressed by index, so repeating the call
 * deletes whatever rule has since shifted into that index, like
 * `delete_dimension`. Rule reads are part of grid data (issue #28), so the
 * index to delete is the one `add_conditional_format_rule` reported.
 */
export const delete_conditional_format_rule = sheetsOperation({
  description:
    'Delete the conditional format rule at an index in a sheet; rules after it shift up by one.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteConditionalFormatRuleRequest',
  schema,
  handler,
});
