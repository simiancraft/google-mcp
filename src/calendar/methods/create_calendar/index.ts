import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/calendars/insert
 *
 * Creates a secondary calendar owned by the user. The new calendar appears on
 * the user's calendar list; the returned id addresses it everywhere else.
 */
export const create_calendar = calendarOperation({
  description: 'Create a secondary calendar.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
