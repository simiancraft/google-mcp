import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Irreversible: permanently removes the event from the calendar. To cancel or
 * decline an invitation instead, use respond_to_event.
 */
export const delete_event = calendarOperation({
  description: 'Delete an event from a calendar, returning the deleted event.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/delete_event',
  schema,
  handler,
});
