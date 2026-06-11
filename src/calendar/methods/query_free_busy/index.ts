import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
 *
 * The raw busy intervals per calendar. The suggest_time tool builds on this
 * same query and computes open slots; this method returns what Google reports,
 * untransformed.
 */
export const query_free_busy = calendarOperation({
  description: 'Query the busy intervals of a set of calendars over a time window.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
