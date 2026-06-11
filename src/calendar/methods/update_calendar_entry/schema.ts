import { z } from 'zod';
import { CalendarListEntry } from '../../entities/CalendarListEntry.js';
import { Reminder } from '../../entities/Reminder.js';

export const schema = {
  input: z.object({
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID of the entry to update. The default is the user's primary calendar.",
      ),
    summaryOverride: z
      .string()
      .optional()
      .describe("The title the user sets for this calendar, overriding the calendar's own."),
    colorId: z
      .string()
      .optional()
      .describe(
        'The color of the calendar: an ID referring to an entry in the calendar section of the colors definition. Superseded by backgroundColor and foregroundColor.',
      ),
    backgroundColor: z
      .string()
      .optional()
      .describe('The main color of the calendar in the hexadecimal format "#0088aa".'),
    foregroundColor: z
      .string()
      .optional()
      .describe('The foreground color of the calendar in the hexadecimal format "#ffffff".'),
    hidden: z.boolean().optional().describe('Whether to hide the calendar from the list.'),
    selected: z
      .boolean()
      .optional()
      .describe('Whether the calendar content shows up in the calendar UI.'),
    defaultReminders: z
      .array(Reminder)
      .optional()
      .describe(
        'The default reminders the user has for this calendar; if set, they replace all existing default reminders.',
      ),
  }),
  output: CalendarListEntry,
};
