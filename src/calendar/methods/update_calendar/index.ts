import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/patch
 * Patch semantics: unset fields are left unchanged.
 */
export const update_calendar = calendarOperation({
  description:
    "Update a calendar's title, description, location, and/or time zone; unset fields are left unchanged.",
  schema,
  handler,
});
