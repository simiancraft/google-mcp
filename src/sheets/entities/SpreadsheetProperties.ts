import { z } from 'zod';

/**
 * A spreadsheet's own metadata: its title, locale, time zone, and recalculation
 * cadence. A projection of the REST `SpreadsheetProperties` (default cell
 * format, iterative-calculation settings, and theme are not carried).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#SpreadsheetProperties
 */
export const SpreadsheetProperties = z.object({
  title: z.string().optional().describe('The title of the spreadsheet.'),
  locale: z
    .string()
    .optional()
    .describe(
      'The locale of the spreadsheet: an ISO 639-1 code such as en, an ISO 639-2 code such as fil, or a language+country combination such as en_US.',
    ),
  timeZone: z
    .string()
    .optional()
    .describe('The time zone of the spreadsheet, in CLDR format such as America/New_York.'),
  autoRecalc: z
    .enum(['ON_CHANGE', 'MINUTE', 'HOUR'])
    .optional()
    .describe('The amount of time to wait before volatile functions are recalculated.'),
});

export type SpreadsheetProperties = z.infer<typeof SpreadsheetProperties>;
