import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/get
 *
 * The calendar's own metadata. For the user's view of a calendar (color,
 * visibility, access role), see get_calendar_entry.
 */
export const get_calendar = calendarOperation({
  description: 'Get a calendar (its title, description, location, and time zone) by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
