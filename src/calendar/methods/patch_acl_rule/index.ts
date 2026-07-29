import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Patch semantics: unset fields are left unchanged, so this is the operation
 * for changing a grant's role without restating its scope. For a whole
 * replacement, see update_acl_rule.
 *
 * Destructive and open-world for the same reasons as update_acl_rule: it
 * changes who can reach a calendar, can escalate a scope to `owner`, and
 * emails the grantee unless sendNotifications is false.
 */
export const patch_acl_rule = calendarOperation({
  description:
    "Update a rule on a calendar's access control list, changing the role granted to a scope; unset fields are left unchanged. Emails the grantee unless sendNotifications is false.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/patch',
  schema,
  handler,
});
