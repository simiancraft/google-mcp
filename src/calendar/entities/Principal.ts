import { z } from 'zod';

/**
 * A person or calendar associated with an event: its creator or organizer.
 *
 * Fields here are the MCP-projected shape of the REST event's `creator` and
 * `organizer` objects (the Profile `id` is omitted). Field docs use `.describe()`
 * so they reach the wire JSON Schema an MCP client reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const Principal = z.object({
  email: z.string().optional().describe("The principal's email address."),
  displayName: z.string().optional().describe("The principal's name, if available."),
  self: z
    .boolean()
    .optional()
    .describe(
      'Whether this principal corresponds to the calendar on which this copy of the event appears.',
    ),
});

export type Principal = z.infer<typeof Principal>;
