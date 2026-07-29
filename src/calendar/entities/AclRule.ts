import { z } from 'zod';
import { AclRole } from './AclRole.js';
import { AclScope } from './AclScope.js';

/**
 * One rule on a calendar's access control list: a single grant pairing a
 * role with the scope it is granted to. The rules of a calendar are what
 * "sharing a calendar" consists of.
 *
 * Google spells the rule's own identifier `id` on the resource, while the
 * path parameter that addresses it is `ruleId`; both spellings are kept as
 * their source uses them. The identifier is derived from the scope
 * (`user:someone@example.com`), so a scope has at most one rule and
 * re-granting the same scope replaces rather than accumulates.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/acl
 */
export const AclRule = z.object({
  id: z.string().describe('Identifier of the access control rule.'),
  role: AclRole.optional().describe('The role assigned to the scope.'),
  scope: AclScope.optional().describe(
    'The extent to which calendar access is granted by this rule.',
  ),
});

export type AclRule = z.infer<typeof AclRule>;
