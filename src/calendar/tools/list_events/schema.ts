import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { Reminder } from '../../entities/Reminder.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/list_events */
export const schema = {
  input: z.object({
    eventTypeFilter: z
      .array(
        z.enum(['default', 'outOfOffice', 'focusTime', 'workingLocation', 'birthday', 'fromGmail']),
      )
      .optional()
      .describe('Event types to return; unset returns all event types.'),
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID to list events from. The default is the user's primary calendar."),
    pageSize: z
      .number()
      .int()
      .max(2500)
      .optional()
      .describe('Maximum number of events returned on one result page (default 250, max 2500).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
    startTime: z
      .string()
      .optional()
      .describe("Lower bound (exclusive) for an event's end time, as an ISO 8601 timestamp."),
    endTime: z
      .string()
      .optional()
      .describe("Upper bound (exclusive) for an event's start time, as an ISO 8601 timestamp."),
    timeZone: z
      .string()
      .optional()
      .describe(
        "Time zone used in the response, as an IANA Time Zone Database name. The default is the calendar's time zone.",
      ),
    orderBy: z
      .enum(['default', 'startTime', 'startTimeDesc', 'lastModified'])
      .optional()
      .describe(
        'The order of the events returned: default (an unspecified, stable order), startTime, startTimeDesc, or lastModified.',
      ),
    fullText: z
      .string()
      .optional()
      .describe(
        'Free-form search query matched across title, description, location, and attendees.',
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
        "The user's access role for this calendar. One of: none, freeBusyReader, reader, writer, owner.",
      ),
    defaultReminders: z
      .array(Reminder)
      .optional()
      .describe(
        'The default reminders on the calendar, applied to all events that do not override them.',
      ),
    events: z.array(Event).describe('The events on the calendar.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
