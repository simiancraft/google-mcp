import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Replaces a rule whole. `scope` is required and `role` is not, mirroring the
 * discovery document, which marks `role` required for `acl.insert` alone. For
 * changing only the role and leaving the rest alone, see patch_acl_rule.
 *
 * This is a PUT, which COVERAGE.md otherwise says the suite skips in favor of
 * patch. The reason that policy exists (a full-resource PUT over a lossy
 * projection clobbers the fields the projection dropped) does not apply here:
 * `role` and `scope` are the whole writable surface of an ACL rule, and both
 * are projected, so nothing can be clobbered by omission.
 *
 * Destructive despite the rubric's "updates are not destructive" default
 * (the `update_event` precedent): this update changes who can reach a
 * calendar, and can escalate a scope to `owner`, which confers control over
 * the calendar's own sharing.
 *
 * Open-world and NOT idempotent, both because `sendNotifications` defaults to
 * true at Google: a replay with identical arguments can send the grantee a
 * second email, which is an additional effect on the environment, so it sits
 * with the rubric's sends cluster rather than its updates cluster. The hint
 * describes the riskiest accepted input, and `src/lib/server.ts` reads
 * `idempotentHint` as permission to silently retry after a credential
 * refresh.
 */
export const update_acl_rule = calendarOperation({
  description:
    "Replace a rule on a calendar's access control list, setting the role granted to a scope. Sends the grantee a sharing notification unless sendNotifications is false.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/update',
  schema,
  handler,
});
