import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The calendar's sharing, read whole: who has access and at what role. This
 * is the operation to run before any of the writes, since a rule's id is
 * derived from its scope and the writes address rules by that id.
 *
 * Reading a calendar's rules itself requires at least writer access to that
 * calendar; a freeBusyReader or reader grant is not enough to see the list.
 */
export const list_acl_rules = calendarOperation({
  description:
    "List the rules on a calendar's access control list: who the calendar is shared with and at what role. Paginated.",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/list',
  schema,
  handler,
});
