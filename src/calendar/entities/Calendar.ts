import { z } from 'zod';

/**
 * A calendar's own metadata: its title, description, geographic location, and
 * time zone. Distinct from the user's calendar list entry, which layers a
 * per-user view (color, visibility, access role) on top of a calendar.
 *
 * Field docs use `.describe()` so they reach the wire JSON Schema an MCP client
 * reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/events-calendars
 */
export const Calendar = z.object({
  id: z.string().describe('Identifier of the calendar.'),
  summary: z.string().optional().describe('Title of the calendar.'),
  description: z.string().optional().describe('Description of the calendar.'),
  location: z
    .string()
    .optional()
    .describe('Geographic location of the calendar as free-form text.'),
  timeZone: z
    .string()
    .optional()
    .describe('The time zone of the calendar, as an IANA Time Zone Database name.'),
});

export type Calendar = z.infer<typeof Calendar>;
