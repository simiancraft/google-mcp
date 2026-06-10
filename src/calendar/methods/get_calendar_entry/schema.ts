import { z } from 'zod';
import { CalendarListEntry } from '../../entities/CalendarListEntry.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/get */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID of the entry to get. The default is the user's primary calendar."),
  }),
  output: CalendarListEntry,
};
