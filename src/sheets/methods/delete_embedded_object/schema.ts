import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the object.'),
    objectId: z
      .number()
      .int()
      .describe('The ID of the embedded object to delete, such as a chart ID from add_chart.'),
  }),
  /** The delete reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the object was deleted from.'),
    objectId: z.number().int().describe('The ID of the deleted object.'),
  }),
};
