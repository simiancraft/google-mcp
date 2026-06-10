import { z } from 'zod';
import { Event } from '../../entities/Event.js';
import { EventDateTime } from '../../entities/EventDateTime.js';

/**
 * The full REST attendee shape, for writing. Unlike the tools' projection
 * (entities/Attendee), `optional` keeps its REST name, and the read-only
 * fields (id, organizer, self) are absent.
 */
const RestAttendee = z.object({
  email: z.string().describe("The attendee's email address."),
  displayName: z.string().optional().describe("The attendee's name."),
  optional: z
    .boolean()
    .optional()
    .describe('Whether this is an optional attendee. The default is false.'),
  resource: z
    .boolean()
    .optional()
    .describe(
      'Whether the attendee is a resource (such as a meeting room). Can only be set when the attendee is first added to the event; later modifications are ignored. The default is false.',
    ),
  responseStatus: z
    .enum(['needsAction', 'declined', 'tentative', 'accepted'])
    .optional()
    .describe("The attendee's response status."),
  comment: z.string().optional().describe("The attendee's response comment."),
  additionalGuests: z
    .number()
    .int()
    .optional()
    .describe('Number of additional guests. The default is 0.'),
});

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/events/patch */
export const schema = {
  input: z.object({
    eventId: z.string().describe('The ID of the event to patch.'),
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the event to patch. The default is the user's primary calendar.",
      ),
    summary: z.string().optional().describe('The new title of the event.'),
    description: z
      .string()
      .optional()
      .describe('The new description of the event. Can contain HTML.'),
    location: z.string().optional().describe('The new location of the event as free-form text.'),
    start: EventDateTime.optional().describe(
      'The new (inclusive) start of the event: date for an all-day event, dateTime otherwise.',
    ),
    end: EventDateTime.optional().describe(
      'The new (exclusive) end of the event: date for an all-day event, dateTime otherwise.',
    ),
    recurrence: z
      .array(z.string())
      .optional()
      .describe(
        'List of RRULE, EXRULE, RDATE, and EXDATE lines for a recurring event, as specified in RFC5545. DTSTART and DTEND lines are not allowed; start and end carry those.',
      ),
    status: z
      .enum(['confirmed', 'tentative', 'cancelled'])
      .optional()
      .describe('Status of the event: confirmed, tentative, or cancelled.'),
    transparency: z
      .enum(['opaque', 'transparent'])
      .optional()
      .describe(
        'Whether the event blocks time on the calendar: opaque (shows as Busy) or transparent (shows as Available).',
      ),
    visibility: z
      .enum(['default', 'public', 'private', 'confidential'])
      .optional()
      .describe('Visibility of the event: default, public, private, or confidential.'),
    attendees: z
      .array(RestAttendee)
      .optional()
      .describe('The full attendee list; if set, it replaces all existing attendees.'),
    extendedProperties: z
      .object({
        private: z
          .record(z.string(), z.string())
          .optional()
          .describe('Properties private to this copy of the event.'),
        shared: z
          .record(z.string(), z.string())
          .optional()
          .describe("Properties shared between copies of the event on other attendees' calendars."),
      })
      .optional()
      .describe('Extended properties of the event: arbitrary string key-value pairs.'),
    guestsCanInviteOthers: z
      .boolean()
      .optional()
      .describe(
        'Whether attendees other than the organizer can invite others to the event. The default is true.',
      ),
    guestsCanModify: z
      .boolean()
      .optional()
      .describe(
        'Whether attendees other than the organizer can modify the event. The default is false.',
      ),
    guestsCanSeeOtherGuests: z
      .boolean()
      .optional()
      .describe(
        "Whether attendees other than the organizer can see who the event's attendees are. The default is true.",
      ),
    colorId: z
      .string()
      .optional()
      .describe(
        'The color of the event: an ID (1 through 11) referring to an entry in the event section of the colors definition.',
      ),
    sendUpdates: z
      .enum(['all', 'externalOnly', 'none'])
      .optional()
      .describe(
        'Which guests receive email notifications about the update: all, externalOnly (attendees outside Google Calendar only), or none.',
      ),
    conferenceDataVersion: z
      .number()
      .int()
      .min(0)
      .max(1)
      .optional()
      .describe(
        "Version number of conference data supported by the client. Set 1 to carry the event's conference data through the patch; 0 (the default) ignores conference data.",
      ),
  }),
  output: Event,
};
