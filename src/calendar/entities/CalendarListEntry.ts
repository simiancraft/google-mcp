import { z } from 'zod';
import { Reminder } from './Reminder.js';

/**
 * A calendar as it appears on the user's calendar list: the per-user view
 * (title override, colors, visibility, access role, default reminders)
 * layered on top of a calendar. Distinct from entities/Calendar, the
 * calendar's own metadata.
 *
 * Field docs use `.describe()` so they reach the wire JSON Schema an MCP
 * client reads.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/calendarList
 */
export const CalendarListEntry = z.object({
  id: z.string().describe('Identifier of the calendar.'),
  summary: z.string().optional().describe('Title of the calendar.'),
  summaryOverride: z
    .string()
    .optional()
    .describe("The title the user has set for this calendar, overriding the calendar's own."),
  description: z.string().optional().describe('Description of the calendar.'),
  location: z
    .string()
    .optional()
    .describe('Geographic location of the calendar as free-form text.'),
  timeZone: z
    .string()
    .optional()
    .describe('The time zone of the calendar, as an IANA Time Zone Database name.'),
  accessRole: z
    .string()
    .optional()
    .describe(
      "The user's effective access role on this calendar. One of: freeBusyReader, reader, writerWithoutPrivateAccess, writer, owner.",
    ),
  colorId: z
    .string()
    .optional()
    .describe(
      'The color of the calendar: an ID referring to an entry in the calendar section of the colors definition.',
    ),
  backgroundColor: z
    .string()
    .optional()
    .describe(
      'The main color of the calendar in the hexadecimal format "#0088aa"; supersedes colorId.',
    ),
  foregroundColor: z
    .string()
    .optional()
    .describe(
      'The foreground color of the calendar in the hexadecimal format "#ffffff"; supersedes colorId.',
    ),
  hidden: z
    .boolean()
    .optional()
    .describe('Whether the calendar has been hidden from the list. Only returned when true.'),
  selected: z
    .boolean()
    .optional()
    .describe('Whether the calendar content shows up in the calendar UI.'),
  primary: z.boolean().optional().describe("Whether this is the user's primary calendar."),
  defaultReminders: z
    .array(Reminder)
    .optional()
    .describe('The default reminders the user has for this calendar.'),
});

export type CalendarListEntry = z.infer<typeof CalendarListEntry>;
