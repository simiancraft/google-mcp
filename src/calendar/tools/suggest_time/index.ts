import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * A composition, not a transcription: there is no REST suggest endpoint. The
 * handler queries freebusy over the window for every attendee calendar,
 * flattens the busy periods, and computes the free slots in lib/suggest.ts.
 * Working hours and weekend exclusion are evaluated in the given time zone
 * (default UTC), judged by each slot's start instant.
 *
 * Refuses rather than degrades: when any attendee's free/busy is unreadable
 * (unknown id, calendar not shared), the handler throws instead of suggesting
 * slots computed from partial data, which would conflict with the unreadable
 * calendar's real events.
 */
export const suggest_time = calendarOperation({
  description: 'Suggest free time slots where the given attendees can meet within a time window.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/suggest_time',
  schema,
  handler,
});
