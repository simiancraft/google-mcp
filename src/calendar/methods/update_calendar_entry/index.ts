import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Edits the user's view of a calendar, not the calendar itself (see
 * update_calendar for that). Patch semantics: unset fields are left
 * unchanged. The handler sends colorRgbFormat=true whenever a hex color
 * field is written, as the API requires.
 */
export const update_calendar_entry = calendarOperation({
  description:
    "Update the user's view of a calendar (title override, colors, visibility, default reminders); unset fields are left unchanged.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/patch',
  schema,
  handler,
});
