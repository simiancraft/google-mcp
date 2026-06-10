import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { NotificationLevel } from '../../entities/NotificationLevel.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/delete_event */
export const schema = {
  input: z.object({
    eventId: z.string().describe('The ID of the event to delete.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the event to delete. The default is the user's primary calendar.",
      ),
    notificationLevel: NotificationLevel.optional().describe(
      'Which email notification should be sent for this event update: NONE (the default, no notifications), EXTERNAL_ONLY (attendees outside Google Calendar only), or ALL (all attendees).',
    ),
  }),
  output: Event,
};
