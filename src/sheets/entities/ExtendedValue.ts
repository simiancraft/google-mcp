import { z } from 'zod';

/**
 * The kinds of value a cell can hold. Provide at most one of the four
 * fields; an empty value represents a cell with no data, which is how a
 * masked write clears a cell's value. The read-only errorValue kind is not
 * carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#ExtendedValue
 */
export const ExtendedValue = z.strictObject({
  stringValue: z
    .string()
    .optional()
    .describe('A string value; stored as-is, never parsed as a formula.'),
  numberValue: z
    .number()
    .optional()
    .describe(
      'A double value; dates, times, and datetimes are represented as doubles in serial number format.',
    ),
  boolValue: z.boolean().optional().describe('A boolean value.'),
  formulaValue: z
    .string()
    .optional()
    .describe(
      'A formula, beginning with =, which executes in the sheet; do not pass untrusted text here.',
    ),
});

export type ExtendedValue = z.infer<typeof ExtendedValue>;
