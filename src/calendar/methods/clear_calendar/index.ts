import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/clear
 *
 * Irreversible: permanently deletes ALL events from the primary calendar while
 * keeping the calendar itself. The API only accepts the primary calendar; for
 * a secondary calendar, delete_calendar is the whole-calendar analog.
 */
export const clear_calendar = calendarOperation({
  description: 'Permanently delete all events from the primary calendar.',
  destructive: true,
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
