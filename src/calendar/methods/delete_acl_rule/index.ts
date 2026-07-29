import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Revokes a grant: the scope loses the access the rule conferred. Destructive
 * under the rubric's removal cluster, and idempotent in effect (a revoked
 * rule stays revoked, though a second call 404s on the missing rule).
 *
 * Closed-world, unlike the other writes: Google sends no notification on
 * access removal, so this operation reaches no external party and takes no
 * sendNotifications parameter. To leave a rule in place but strip its
 * access, patch its role to `none` instead.
 */
export const delete_acl_rule = calendarOperation({
  description:
    "Revoke a rule from a calendar's access control list, removing that scope's access to the calendar. Access removal does not send sharing notifications.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/delete',
  schema,
  handler,
});
