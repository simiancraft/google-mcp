import { z } from 'zod';

export const schema = {
  input: z.strictObject({
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
