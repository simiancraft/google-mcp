import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/list_events
 *
 * `fullText` maps to the REST `q` free-text search. The startTime and
 * startTimeDesc orderings require expanding recurring events into single
 * instances (REST `singleEvents`); startTimeDesc is served by reversing the
 * ascending page, since the REST API has no descending order.
 */
export const list_events = calendarOperation({
  description: 'List events on a calendar, optionally filtered, ordered, and paginated.',
  schema,
  handler,
});
