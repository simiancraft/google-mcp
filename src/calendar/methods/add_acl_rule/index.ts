import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Grants access to a calendar. Destructive under the rubric's
 * standing-side-effect cluster (the `create_filter` and
 * `sheets/add_protected_range` precedents): the grant keeps conferring access
 * until something revokes it, so it is not merely additive, and `owner` hands
 * the grantee control of this calendar's sharing.
 *
 * Open-world because `sendNotifications` defaults to true at Google, so a
 * grant emails the scope, which may be an address outside the organization
 * entirely. Pass `sendNotifications: false` to grant silently.
 *
 * A rule's id derives from its scope, so granting a scope that already has a
 * rule replaces that rule's role rather than adding a second one, and does not
 * conflict. Verified against the live API rather than inferred: a second
 * insert for the same scope returned the same rule id with the new role, and
 * the calendar was left with one rule for that scope.
 */
export const add_acl_rule = calendarOperation({
  description:
    'Share a calendar by adding a rule to its access control list, granting a role (none, freeBusyReader, reader, writerWithoutPrivateAccess, writer, or owner) to a scope (a user, a group, a domain, or the public). Sharing notifications are enabled by default; pass sendNotifications false to suppress them.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/insert',
  schema,
  handler,
});
