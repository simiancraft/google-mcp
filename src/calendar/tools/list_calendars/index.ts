import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Each entry is projected to the documented four fields (id, summary,
 * description, and timeZone); the calendar list's per-user view (colors,
 * visibility, and access role) is not part of this tool's surface.
 */
export const list_calendars = calendarOperation({
  description: "List the calendars on the user's calendar list, paginated.",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/list_calendars',
  schema,
  handler,
});
