import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Expands one recurring series into its individual instances; list_events
 * cannot scope its expansion to a single series. One semantic difference from
 * the list bounds: timeMin here is inclusive of an instance's end time, where
 * list_events' startTime is exclusive.
 */
export const list_event_instances = calendarOperation({
  description: 'List the instances of a recurring event, optionally filtered and paginated.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/events/instances',
  schema,
  handler,
});
