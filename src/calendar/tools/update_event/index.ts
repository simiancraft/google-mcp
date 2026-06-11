import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/update_event
 *
 * Patch semantics: unset fields are left unchanged. Attendee changes are
 * deltas (addedAttendeeEmails and removedAttendeeEmails) applied to the
 * event's current guest list, which the handler reads first. Recurrence is
 * not editable here; the patch_event method covers it.
 */
export const update_event = calendarOperation({
  description:
    'Update fields of an existing event; unset fields are left unchanged. Attendee changes are deltas; for whole-list replacement and the REST-only fields (recurrence, transparency, extendedProperties), use patch_event.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
