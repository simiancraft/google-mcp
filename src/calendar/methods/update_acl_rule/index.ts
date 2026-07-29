import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Replaces a rule whole; both role and scope are required. For changing only
 * the role and leaving the rest alone, see patch_acl_rule.
 *
 * Destructive despite the rubric's "updates are not destructive" default
 * (the `update_event` precedent): this update changes who can reach a
 * calendar, and can escalate a scope to `owner`, which confers control over
 * the calendar's own sharing. Open-world for the same reason as
 * add_acl_rule: `sendNotifications` defaults to true at Google.
 *
 * Idempotent: replaying the same replacement leaves the same rule.
 */
export const update_acl_rule = calendarOperation({
  description:
    "Replace a rule on a calendar's access control list, setting the role granted to a scope. Emails the grantee unless sendNotifications is false.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/update',
  schema,
  handler,
});
