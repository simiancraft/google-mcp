import { z } from 'zod';
import { Event } from '../../entities/Event.js';

export const schema = {
  input: z.strictObject({
    eventId: z.string().describe('The ID of the event to get.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID to get the event from. The default is the user's primary calendar.",
      ),
  }),
  output: Event,
};
