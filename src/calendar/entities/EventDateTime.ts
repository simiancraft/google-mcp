import { z } from 'zod';

/**
 * The start or end of an event: either an all-day calendar date or a precise
 * timestamp, plus an optional time zone.
 *
 * The shape is a tri-state with an XOR at its core: exactly one of `date` or
 * `dateTime` is set (a zod refinement enforces this). `timeZone` is optional
 * for single events and required on recurring events, where it specifies the
 * zone in which the recurrence is expanded.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const EventDateTime = z
  .strictObject({
    date: z
      .string()
      .optional()
      .describe('The date, in the format "yyyy-mm-dd", if this is an all-day event.'),
    dateTime: z
      .string()
      .optional()
      .describe(
        'The time, as a combined date-time value formatted according to RFC3339. A time zone offset is required unless a time zone is explicitly specified in timeZone.',
      ),
    timeZone: z
      .string()
      .optional()
      .describe(
        'The time zone in which the time is specified, formatted as an IANA Time Zone Database name (for example "Europe/Zurich"). Required for recurring events.',
      ),
  })
  .refine((value) => (value.date === undefined) !== (value.dateTime === undefined), {
    message: 'Exactly one of date or dateTime must be set.',
  })
  // The refinement does not survive into the emitted JSON Schema, so the rule is
  // restated as the object's description, where an MCP client can read it.
  .describe(
    'The start or end of an event. Exactly one of date (all-day) or dateTime (timed) must be set; timeZone is required for recurring events.',
  );

export type EventDateTime = z.infer<typeof EventDateTime>;
