import { z } from 'zod';
import { CalendarListEntry } from '../../entities/CalendarListEntry.js';

export const schema = {
  input: z.strictObject({
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID of the entry to get. The default is the user's primary calendar."),
  }),
  output: CalendarListEntry,
};
