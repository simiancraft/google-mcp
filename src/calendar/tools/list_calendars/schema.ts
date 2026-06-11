import { z } from 'zod';
import { Calendar } from '../../entities/Calendar.js';

export const schema = {
  input: z.object({
    pageSize: z
      .number()
      .int()
      .max(250)
      .optional()
      .describe('Maximum number of entries returned on one result page (default 100, max 250).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
  }),
  output: z.object({
    // The documented projection carries no location; the Calendar entity's
    // location field serves the calendars resource methods.
    calendars: z
      .array(Calendar.omit({ location: true }))
      .describe("List of calendars on the user's calendar list."),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
