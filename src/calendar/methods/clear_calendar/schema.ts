import { z } from 'zod';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/clear */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .optional()
      .describe(
        'The calendar ID to clear. The default (and the only value the API accepts) is the primary calendar.',
      ),
  }),
  /** Clear returns no body; we confirm the id. */
  output: z.object({
    calendarId: z.string().describe('The ID of the cleared calendar.'),
  }),
};
