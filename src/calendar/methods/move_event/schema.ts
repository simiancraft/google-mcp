import { z } from 'zod';
import { Event } from '../../entities/Event.js';

export const schema = {
  input: z.strictObject({
    eventId: z.string().describe('The ID of the event to move.'),
    destination: z.string().describe('The calendar ID of the target calendar the event moves to.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the source calendar the event is currently on. The default is the user's primary calendar.",
      ),
    sendUpdates: z
      .enum(['all', 'externalOnly', 'none'])
      .optional()
      .describe(
        "Which guests receive email notifications about the change of the event's organizer: all, externalOnly (attendees outside Google Calendar only), or none.",
      ),
  }),
  output: Event,
};
