import { z } from 'zod';
import { Attendee } from './Attendee.js';
import { EventDateTime } from './EventDateTime.js';
import { Principal } from './Principal.js';
import { Reminder } from './Reminder.js';

/**
 * An event on a calendar: a single appointment or a recurring series, with a
 * title, start and end times, attendees, and conference details.
 *
 * Fields here are the MCP-projected shape of the REST `events` resource:
 * `conferenceData` collapses to the `conferenceUrl` string, attendee `optional`
 * is renamed `optionalAttendee`, and `reminders.overrides` surfaces as
 * `overrideReminders`. Field docs use `.describe()` so they reach the wire JSON
 * Schema an MCP client reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const Event = z.object({
  id: z.string().describe('Opaque identifier of the event.'),
  status: z
    .string()
    .optional()
    .describe('Status of the event. One of: confirmed, tentative, cancelled.'),
  htmlLink: z
    .string()
    .optional()
    .describe('An absolute link to this event in the Google Calendar Web UI.'),
  created: z.string().optional().describe('Creation time of the event (as an RFC3339 timestamp).'),
  updated: z
    .string()
    .optional()
    .describe('Last modification time of the main event data (as an RFC3339 timestamp).'),
  summary: z.string().optional().describe('Title of the event.'),
  description: z.string().optional().describe('Description of the event. Can contain HTML.'),
  location: z.string().optional().describe('Geographic location of the event as free-form text.'),
  creator: Principal.optional().describe('The creator of the event.'),
  organizer: Principal.optional().describe('The organizer of the event.'),
  start: EventDateTime.optional().describe(
    'The (inclusive) start time of the event. For a recurring event, this is the start time of the first instance.',
  ),
  end: EventDateTime.optional().describe(
    'The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.',
  ),
  recurrence: z
    .array(z.string())
    .optional()
    .describe(
      'List of RRULE, EXRULE, RDATE, and EXDATE lines for a recurring event, as specified in RFC5545.',
    ),
  recurringEventId: z
    .string()
    .optional()
    .describe(
      'For an instance of a recurring event, the id of the recurring event to which this instance belongs.',
    ),
  originalStartTime: EventDateTime.optional().describe(
    'For an instance of a recurring event, the time at which this event would start according to the recurrence data.',
  ),
  transparency: z
    .string()
    .optional()
    .describe(
      'Whether the event blocks time on the calendar. One of: opaque (blocks time), transparent (does not block time).',
    ),
  visibility: z
    .string()
    .optional()
    .describe('Visibility of the event. One of: default, public, private, confidential.'),
  attendees: z.array(Attendee).optional().describe('The attendees of the event.'),
  eventType: z
    .string()
    .optional()
    .describe(
      'Specific type of the event. One of: birthday, default, focusTime, fromGmail, outOfOffice, workingLocation.',
    ),
  conferenceUrl: z.string().optional().describe('The Google Meet link for the event.'),
  colorId: z
    .string()
    .optional()
    .describe(
      'The color of the event: an ID referring to an entry in the event section of the colors definition.',
    ),
  overrideReminders: z
    .array(Reminder)
    .optional()
    .describe('Event-specific reminders, overriding the calendar defaults.'),
});

export type Event = z.infer<typeof Event>;
