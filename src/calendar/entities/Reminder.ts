import { z } from 'zod';

/**
 * A reminder on an event for the authenticated user: how and when to be
 * notified before the event starts.
 *
 * Field docs use `.describe()` so they reach the wire JSON Schema an MCP client
 * reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const Reminder = z.strictObject({
  method: z
    .enum(['email', 'popup'])
    .optional()
    .describe(
      'The delivery method of the reminder: email or a UI popup. Required when writing a reminder; absent on read only if Google reports a method this server does not know.',
    ),
  minutes: z
    .number()
    .int()
    .describe('Number of minutes before the event start that the reminder should be delivered.'),
});

export type Reminder = z.infer<typeof Reminder>;
