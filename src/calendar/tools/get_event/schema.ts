import { z } from 'zod';
import { Event } from '../../entities/Event.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/get_event */
export const schema = {
  input: z.object({
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
