import { z } from 'zod';

/**
 * How a cell's number renders: a format type plus an optional pattern string.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#NumberFormat
 */
export const NumberFormat = z.strictObject({
  type: z
    .enum(['TEXT', 'NUMBER', 'PERCENT', 'CURRENCY', 'DATE', 'TIME', 'DATE_TIME', 'SCIENTIFIC'])
    .describe('The type of the number format.'),
  pattern: z
    .string()
    .optional()
    .describe(
      'Pattern string used for formatting, such as "$#,##0.00" or "0.0%". Omitted, the locale default for the type applies. Patterns follow the date and number formats guide.',
    ),
});

export type NumberFormat = z.infer<typeof NumberFormat>;
