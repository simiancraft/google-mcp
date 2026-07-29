import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { Reminder } from '../../entities/Reminder.js';

export const schema = {
  input: z.strictObject({
    eventId: z.string().describe('The ID of the recurring event to expand.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the recurring event. The default is the user's primary calendar.",
      ),
    maxResults: z
      .number()
      .int()
      .max(2500)
      .optional()
      .describe('Maximum number of instances returned on one result page (default 250, max 2500).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
    originalStart: z
      .string()
      .optional()
      .describe('Filter to the single instance whose original start time matches this value.'),
    showDeleted: z
      .boolean()
      .optional()
      .describe(
        'Whether to include deleted instances (with status "cancelled") in the result. The default is false.',
      ),
    timeMin: z
      .string()
      .optional()
      .describe(
        "Lower bound (inclusive) for an instance's end time, as an RFC3339 timestamp with a mandatory time zone offset. Unlike list_events, this bound is inclusive.",
      ),
    timeMax: z
      .string()
      .optional()
      .describe(
        "Upper bound (exclusive) for an instance's start time, as an RFC3339 timestamp with a mandatory time zone offset.",
      ),
    timeZone: z
      .string()
      .optional()
      .describe(
        "Time zone used in the response, as an IANA Time Zone Database name. The default is the calendar's time zone.",
      ),
  }),
  output: z.object({
    summary: z.string().optional().describe('Title of the calendar.'),
    description: z.string().optional().describe('Description of the calendar.'),
    updated: z
      .string()
      .optional()
      .describe('Last modification time of the calendar (as an ISO 8601 timestamp).'),
    timeZone: z.string().optional().describe('The time zone of the calendar.'),
    accessRole: z
      .string()
      .optional()
      .describe(
        "The user's access role for this calendar. One of: none, freeBusyReader, reader, writerWithoutPrivateAccess, writer, owner.",
      ),
    defaultReminders: z
      .array(Reminder)
      .optional()
      .describe(
        'The default reminders on the calendar, applied to all events that do not override them.',
      ),
    events: z.array(Event).describe('The instances of the recurring event.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
