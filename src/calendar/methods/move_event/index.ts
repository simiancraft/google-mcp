import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/events/move
 *
 * Changes which calendar an event lives on, making the destination calendar
 * its organizer. The API only moves events whose eventType is `default`;
 * other types (focusTime, outOfOffice, workingLocation, birthday, fromGmail)
 * are rejected.
 */
export const move_event = calendarOperation({
  description: 'Move an event to another calendar; only default-type events can move.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
