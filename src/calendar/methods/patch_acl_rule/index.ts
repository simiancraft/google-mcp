import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Patch semantics: unset fields are left unchanged, so this is the operation
 * for changing a grant's role without restating its scope. For a whole
 * replacement, see update_acl_rule.
 *
 * Destructive and open-world for the same reasons as update_acl_rule: it
 * changes who can reach a calendar, and can escalate a scope to `owner`.
 *
 * Not idempotent, also for update_acl_rule's reason: `sendNotifications`
 * defaults to true at Google, so replaying identical arguments can send a
 * second email, and `src/lib/server.ts` reads `idempotentHint` as permission
 * to silently retry after a credential refresh.
 */
export const patch_acl_rule = calendarOperation({
  description:
    "Update a rule on a calendar's access control list, changing the role granted to a scope; unset fields are left unchanged. Sends the grantee a sharing notification unless sendNotifications is false.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/patch',
  schema,
  handler,
});
