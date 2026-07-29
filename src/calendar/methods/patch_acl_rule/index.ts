import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Patch semantics: unset fields are left unchanged, so this is the operation
 * for changing a grant's role without restating its scope. For a whole
 * replacement, see update_acl_rule.
 *
 * Destructive on the standing-side-effect precedent of `gmail/create_filter`
 * and `sheets/add_protected_range` rather than the rubric's update default:
 * it changes who can reach a calendar, the access persists until revoked, and
 * it can escalate a scope to `owner`.
 *
 * Open-world and not idempotent on the precedent of the sends
 * (`gmail/send_message`, `gmail/send_draft`): `sendNotifications` defaults to
 * true at Google, so replaying identical arguments can send a second email,
 * and `src/lib/server.ts` reads `idempotentHint` as permission to silently
 * retry after a credential refresh. Lowering a role sends nothing, since
 * Google does not notify on access removal.
 */
export const patch_acl_rule = calendarOperation({
  description:
    "Update a rule on a calendar's access control list, changing the role granted to a scope; unset fields are left unchanged. Granting or raising access sends the grantee a sharing notification unless sendNotifications is false; lowering or removing access never notifies.",
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
