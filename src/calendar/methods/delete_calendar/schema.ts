import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    // Required, no primary default: the caller must name the calendar it is
    // destroying, and the primary calendar cannot be deleted anyway.
    calendarId: z.string().describe('The calendar ID of the secondary calendar to delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    calendarId: z.string().describe('The ID of the deleted calendar.'),
  }),
};
