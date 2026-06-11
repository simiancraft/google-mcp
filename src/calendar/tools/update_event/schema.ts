import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { NotificationLevel } from '../../entities/NotificationLevel.js';
import { Reminder } from '../../entities/Reminder.js';

export const schema = {
  input: z.object({
    eventId: z.string().describe('The ID of the event to update.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the event to update. The default is the user's primary calendar.",
      ),
    summary: z.string().optional().describe('The new title of the event.'),
    description: z
      .string()
      .optional()
      .describe('The new description of the event. Can contain HTML.'),
    location: z.string().optional().describe('The new location of the event.'),
    startTime: z
      .string()
      .optional()
      .describe('The new start time of the event, formatted as per ISO 8601.'),
    endTime: z
      .string()
      .optional()
      .describe('The new end time of the event, formatted as per ISO 8601.'),
    addedAttendeeEmails: z
      .array(z.string())
      .optional()
      .describe('Additional attendees of the event, as email addresses.'),
    removedAttendeeEmails: z
      .array(z.string())
      .optional()
      .describe('Attendees to remove from the event, as email addresses.'),
    overrideReminders: z
      .array(Reminder)
      .optional()
      .describe('Reminders defined for this event; if set, they replace all existing reminders.'),
    notificationLevel: NotificationLevel.optional().describe(
      'Which email notification should be sent for this event update: NONE (the default, no notifications), EXTERNAL_ONLY (attendees outside Google Calendar only), or ALL (all attendees).',
    ),
    addGoogleMeetUrl: z
      .boolean()
      .optional()
      .describe('Whether to create or update a Google Meet URL for the event.'),
    googleMeetUrl: z
      .string()
      .optional()
      .describe(
        'An existing Google Meet URL or meeting ID to attach to the event. Wins over addGoogleMeetUrl when both are given.',
      ),
    visibility: z
      .enum(['default', 'public', 'private'])
      .optional()
      .describe('Visibility of the event: default, public, or private.'),
    colorId: z
      .string()
      .optional()
      .describe(
        'The color of the event: an ID (1 through 11) referring to an entry in the event section of the colors definition.',
      ),
  }),
  output: Event,
};
