import { z } from 'zod';
import { Calendar } from '../../entities/Calendar.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/patch */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID to update. The default is the user's primary calendar."),
    summary: z.string().optional().describe('The new title of the calendar.'),
    description: z.string().optional().describe('The new description of the calendar.'),
    location: z
      .string()
      .optional()
      .describe('The new geographic location of the calendar as free-form text.'),
    timeZone: z
      .string()
      .optional()
      .describe('The new time zone of the calendar, as an IANA Time Zone Database name.'),
  }),
  output: Calendar,
};
