import { z } from 'zod';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/delete */
export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .describe("The calendar ID of the entry to remove from the user's calendar list."),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    calendarId: z.string().describe('The ID of the removed calendar list entry.'),
  }),
};
