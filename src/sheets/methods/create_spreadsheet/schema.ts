import { z } from 'zod';
import { Spreadsheet } from '../../entities/Spreadsheet.js';

/**
 * Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/create
 *
 * The REST body is a full Spreadsheet resource; this input is the curated
 * subset that makes sense at creation time (the rest of the resource is
 * formatting and grid data, deferred with issues #27 and #28).
 */
export const schema = {
  input: z.object({
    title: z.string().describe('The title of the spreadsheet.'),
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
    sheets: z
      .array(z.object({ title: z.string().describe('The name of the sheet.') }))
      .optional()
      .describe(
        'The sheets (tabs) to create the spreadsheet with, by title. Omitted, the spreadsheet gets one default sheet.',
      ),
  }),
  output: Spreadsheet,
};
