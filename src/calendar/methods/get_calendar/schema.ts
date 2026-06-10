import { z } from 'zod';
import { Calendar } from '../../entities/Calendar.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/get */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID to get. The default is the user's primary calendar."),
  }),
  output: Calendar,
};
