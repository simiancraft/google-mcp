import { z } from 'zod';

/** An HH:MM hour-of-day bound, for example 09:00. */
const hourOfDay = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/suggest_time */
export const schema = {
  input: z.object({
    attendeeEmails: z
      .array(z.string())
      .describe(
        "The attendee emails to find free time for. Include the literal 'primary' for the authenticated user's primary calendar.",
      ),
    startTime: z
      .string()
      .describe('The start of the interval for the query, as an ISO 8601 timestamp.'),
    endTime: z
      .string()
      .describe('The end of the interval for the query, as an ISO 8601 timestamp.'),
    timeZone: z
      .string()
      .optional()
      .describe(
        'Time zone used for the working-hour and weekend preferences, as an IANA Time Zone Database name (for example America/Los_Angeles). The default is UTC.',
      ),
    durationMinutes: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'Minimum duration of a free time slot in minutes (default 30); suggested slots are exactly this length.',
      ),
    preferences: z
      .object({
        startHour: z
          .string()
          .regex(hourOfDay, 'Expected an HH:MM hour of day, for example 09:00.')
          .optional()
          .describe('The preferred start hour of day, as HH:MM (for example 09:00).'),
        endHour: z
          .string()
          .regex(hourOfDay, 'Expected an HH:MM hour of day, for example 17:00.')
          .optional()
          .describe('The preferred end hour of day, as HH:MM (for example 17:00).'),
        excludeWeekends: z
          .boolean()
          .optional()
          .describe('Whether to exclude weekends (Saturdays and Sundays).'),
        pageSize: z
          .number()
          .int()
          .positive()
          .max(50)
          .optional()
          .describe('Maximum number of time slots to return (default 5, max 50).'),
      })
      .optional()
      .describe('Scheduling preferences narrowing where the suggested slots may fall.'),
  }),
  output: z.object({
    timeSlots: z
      .array(
        z.object({
          startTime: z
            .string()
            .describe('The start time of the free time slot, as an ISO 8601 timestamp.'),
          endTime: z
            .string()
            .describe('The end time of the free time slot, as an ISO 8601 timestamp.'),
          durationMinutes: z
            .number()
            .int()
            .describe('The duration of the free time slot in minutes.'),
        }),
      )
      .describe('The suggested free time slots, in chronological order.'),
  }),
};
