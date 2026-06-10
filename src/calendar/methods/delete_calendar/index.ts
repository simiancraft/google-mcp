import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/delete
 *
 * Irreversible: permanently removes a secondary calendar and every event on
 * it. The primary calendar cannot be deleted (the API rejects it); to wipe the
 * primary calendar's events, see clear_calendar. To merely unsubscribe from a
 * calendar without destroying it, see remove_calendar_entry.
 */
export const delete_calendar = calendarOperation({
  description: 'Permanently delete a secondary calendar and all of its events.',
  destructive: true,
  schema,
  handler,
});
