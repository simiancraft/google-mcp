import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/respond_to_event
 *
 * A composition, not a transcription of one REST method: the handler reads
 * the event, rewrites the self attendee's responseStatus (and comment, when
 * given), and patches the attendee array back.
 */
export const respond_to_event = calendarOperation({
  description: 'Respond to an event invitation: declined, tentative, or accepted.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
