import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { NotificationLevel } from '../../entities/NotificationLevel.js';
import { Reminder } from '../../entities/Reminder.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/create_event */
export const schema = {
  input: z.object({
    summary: z.string().describe('Title of the event.'),
    startTime: z.string().describe('The start time of the event, formatted as per ISO 8601.'),
    endTime: z.string().describe('The end time of the event, formatted as per ISO 8601.'),
    attendeeEmails: z
      .array(z.string())
      .optional()
      .describe('The additional attendees of the event, as email addresses.'),
    recurrenceData: z
      .array(z.string())
      .optional()
      .describe('The recurrence data of the event, as RRULE, RDATE, or EXDATE lines per RFC 5545.'),
    overrideReminders: z
      .array(Reminder)
      .optional()
      .describe('Reminders defined for this event, overriding the default reminders.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID to create the event on. The default is the user's primary calendar.",
      ),
    description: z.string().optional().describe('Description of the event. Can contain HTML.'),
    location: z.string().optional().describe('Geographic location of the event as free-form text.'),
    allDay: z.boolean().optional().describe('Whether the event is an all-day event.'),
    timeZone: z
      .string()
      .optional()
      .describe(
        "Time zone of the event, as an IANA Time Zone Database name. The default is the calendar's time zone.",
      ),
    notificationLevel: NotificationLevel.optional().describe(
      'Which email notification should be sent for this event update: NONE (the default, no notifications), EXTERNAL_ONLY (attendees outside Google Calendar only), or ALL (all attendees).',
    ),
    addGoogleMeetUrl: z
      .boolean()
      .optional()
      .describe('Whether to create a Google Meet URL for the event.'),
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
    googleMeetUrl: z
      .string()
      .optional()
      .describe(
        'An existing Google Meet URL or meeting ID to attach to the event. Wins over addGoogleMeetUrl when both are given.',
      ),
  }),
  output: Event,
};
