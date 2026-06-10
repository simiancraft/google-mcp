import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/insert
 *
 * Subscribes the user to an existing calendar (one shared with them, or a
 * public one) by adding it to their calendar list; it does not create a
 * calendar (see create_calendar). The inverse is remove_calendar_entry; the
 * per-user view (colors, visibility) is edited with update_calendar_entry.
 */
export const add_calendar_entry = calendarOperation({
  description: "Add an existing calendar to the user's calendar list (subscribe).",
  schema,
  handler,
});
