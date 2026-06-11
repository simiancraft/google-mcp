import { z } from 'zod';
import { Event } from '../../entities/Event.js';

export const schema = {
  input: z.strictObject({
    text: z
      .string()
      .describe(
        'Natural-language text describing the event to create, for example "Lunch with Anna 11:30am Friday at Ludivine".',
      ),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID to create the event on. The default is the user's primary calendar.",
      ),
    sendUpdates: z
      .enum(['all', 'externalOnly', 'none'])
      .optional()
      .describe(
        'Which guests receive email notifications about the creation: all, externalOnly (attendees outside Google Calendar only), or none.',
      ),
  }),
  output: Event,
};
