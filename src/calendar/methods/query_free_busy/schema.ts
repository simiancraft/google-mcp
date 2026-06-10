import { z } from 'zod';
import { FreeBusyCalendar } from '../../entities/FreeBusy.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query */
export const schema = {
  input: z.object({
    timeMin: z
      .string()
      .describe('The start of the interval for the query, as an RFC3339 timestamp.'),
    timeMax: z.string().describe('The end of the interval for the query, as an RFC3339 timestamp.'),
    timeZone: z
      .string()
      .optional()
      .describe(
        'Time zone used in the response, as an IANA Time Zone Database name. The default is UTC.',
      ),
    items: z
      .array(
        z.object({
          id: z
            .string()
            .describe("A calendar id to query; use 'primary' for the user's primary calendar."),
        }),
      )
      .describe('The calendars to query.'),
  }),
  output: z.object({
    timeMin: z
      .string()
      .optional()
      .describe('The start of the queried interval, as an RFC3339 timestamp.'),
    timeMax: z
      .string()
      .optional()
      .describe('The end of the queried interval, as an RFC3339 timestamp.'),
    calendars: z
      .record(z.string(), FreeBusyCalendar)
      .describe('Free/busy information per queried calendar id.'),
  }),
};
