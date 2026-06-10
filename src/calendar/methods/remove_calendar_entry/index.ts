import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/delete
 *
 * Unsubscribes the user from a calendar. Not marked destructive: the calendar
 * and its events are untouched, and re-adding the entry (add_calendar_entry)
 * reverses it. delete_calendar is the irreversible cousin.
 */
export const remove_calendar_entry = calendarOperation({
  description:
    "Remove a calendar from the user's calendar list (unsubscribe); the calendar itself is untouched.",
  schema,
  handler,
});
