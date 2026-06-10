import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/settings/list
 *
 * The user's Calendar settings, for example timezone, weekStart, and
 * format24HourTime.
 */
export const list_settings = calendarOperation({
  description: "List the user's Calendar settings, paginated.",
  schema,
  handler,
});
