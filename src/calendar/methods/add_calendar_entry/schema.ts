import { z } from 'zod';
import { CalendarListEntry } from '../../entities/CalendarListEntry.js';

export const schema = {
  input: z.strictObject({
    calendarId: z
      .string()
      .describe("The calendar ID of the existing calendar to add to the user's calendar list."),
  }),
  output: CalendarListEntry,
};
