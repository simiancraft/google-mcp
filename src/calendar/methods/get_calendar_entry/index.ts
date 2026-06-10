import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/get
 *
 * The user's view of a calendar on their calendar list. For the calendar's
 * own metadata, see get_calendar.
 */
export const get_calendar_entry = calendarOperation({
  description:
    "Get the user's calendar list entry for a calendar: access role, colors, visibility, and default reminders.",
  schema,
  handler,
});
