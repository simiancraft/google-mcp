import { z } from 'zod';

/**
 * An attendee of an event, with their invitation response.
 *
 * Fields here are the MCP-projected shape of the REST event attendee: the REST
 * `optional` flag is renamed `optionalAttendee`. Field docs use `.describe()`
 * so they reach the wire JSON Schema an MCP client reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const Attendee = z.object({
  id: z.string().optional().describe("The attendee's Profile ID, if available."),
  email: z
    .string()
    .describe(
      "The attendee's email address. Required when adding an attendee; must be a valid address as per RFC5322.",
    ),
  displayName: z.string().optional().describe("The attendee's name, if available."),
  organizer: z.boolean().optional().describe('Whether the attendee is the organizer of the event.'),
  self: z
    .boolean()
    .optional()
    .describe(
      'Whether this entry represents the calendar on which this copy of the event appears.',
    ),
  resource: z
    .boolean()
    .optional()
    .describe('Whether the attendee is a resource, such as a meeting room.'),
  optionalAttendee: z.boolean().optional().describe('Whether this is an optional attendee.'),
  responseStatus: z
    .string()
    .optional()
    .describe(
      "The attendee's response status. One of: needsAction, declined, tentative, accepted.",
    ),
  comment: z.string().optional().describe("The attendee's response comment."),
  additionalGuests: z.number().int().optional().describe('Number of additional guests.'),
});

export type Attendee = z.infer<typeof Attendee>;
