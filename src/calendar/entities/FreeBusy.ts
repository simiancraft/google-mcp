import { z } from 'zod';

/**
 * A contiguous busy interval on a calendar.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
 */
export const TimePeriod = z.object({
  start: z.string().describe('The (inclusive) start of the time period, as an RFC3339 timestamp.'),
  end: z.string().describe('The (exclusive) end of the time period, as an RFC3339 timestamp.'),
});

export type TimePeriod = z.infer<typeof TimePeriod>;

/**
 * The free/busy expansion for one queried calendar: its busy intervals, or
 * the errors that kept Google from computing them (for example a calendar id
 * the user cannot read).
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
 */
export const FreeBusyCalendar = z.object({
  busy: z
    .array(TimePeriod)
    .describe('Time ranges during which this calendar should be regarded as busy.'),
  errors: z
    .array(
      z.object({
        domain: z.string().optional().describe('Domain, or broad category, of the error.'),
        reason: z
          .string()
          .optional()
          .describe('Specific reason for the error, for example notFound.'),
      }),
    )
    .optional()
    .describe('Errors that kept Google from computing free/busy for this calendar.'),
});

export type FreeBusyCalendar = z.infer<typeof FreeBusyCalendar>;
