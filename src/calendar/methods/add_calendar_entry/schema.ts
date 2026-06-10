import { z } from 'zod';
import { CalendarListEntry } from '../../entities/CalendarListEntry.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/insert */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .describe("The calendar ID of the existing calendar to add to the user's calendar list."),
  }),
  output: CalendarListEntry,
};
