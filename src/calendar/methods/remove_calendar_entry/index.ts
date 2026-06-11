import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Unsubscribes the user from a calendar. Annotated destructive as a removal
 * (matching Google's unlabel precedent), though the calendar
 * and its events are untouched, and re-adding the entry (add_calendar_entry)
 * reverses it. delete_calendar is the irreversible cousin.
 */
export const remove_calendar_entry = calendarOperation({
  description:
    "Remove a calendar from the user's calendar list (unsubscribe); the calendar itself is untouched.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/delete',
  schema,
  handler,
});
