import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Patch semantics: unset fields are left unchanged.
 */
export const update_calendar = calendarOperation({
  description:
    "Update a calendar's title, description, location, and/or time zone; unset fields are left unchanged.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/calendars/patch',
  schema,
  handler,
});
