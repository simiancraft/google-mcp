import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Rules have no ID: they live per sheet in an ordered list and are addressed
 * by (sheetId, index), so the update, move, and delete operations take the
 * index this add reports. The reply is empty; the output echoes where the
 * rule landed.
 */
export const add_conditional_format_rule = sheetsOperation({
  description:
    'Add a conditional format rule to a spreadsheet: a boolean rule formats cells matching a condition, and a gradient rule paints a continuous color scale (a heat map) across a range; either recalculates as values change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddConditionalFormatRuleRequest',
  schema,
  handler,
});
