import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/create_event
 *
 * allDay collapses the ISO timestamps to all-day calendar dates.
 * addGoogleMeetUrl asks Google to mint a Meet link via a conference create
 * request; an explicit googleMeetUrl wins over it and attaches as is.
 * overrideReminders replaces the calendar's default reminders.
 */
export const create_event = calendarOperation({
  description: 'Create an event on a calendar.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
