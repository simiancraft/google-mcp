import { z } from 'zod';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/delete */
export const schema = {
  input: z.object({
    // Required, no primary default: the caller must name the calendar it is
    // destroying, and the primary calendar cannot be deleted anyway.
    calendarId: z.string().describe('The calendar ID of the secondary calendar to delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    calendarId: z.string().describe('The ID of the deleted calendar.'),
  }),
};
