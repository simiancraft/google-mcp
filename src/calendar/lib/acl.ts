import type { calendar_v3 } from '@googleapis/calendar';
import { narrow } from '../../lib/utils/narrow.js';
import { AclRole } from '../entities/AclRole.js';
import type { AclRule } from '../entities/AclRule.js';
import { type AclScope, AclScopeType } from '../entities/AclScope.js';

/**
 * Project a REST ACL rule onto the AclRule shape, cleaning nulls to
 * undefined and narrowing the output enums (EXTENDING.md, "Enum policy").
 *
 * `type` discriminates AclScope, so an unrecognized type drops the whole scope
 * rather than emitting a scope that matches neither branch: the field goes
 * absent instead of the object going malformed. A caller that sees a rule with
 * a role but no scope is looking at a scope type this surface predates.
 *
 * The scope is also normalized onto whichever branch it belongs to, so a
 * projection can never produce a rule that fails its own schema: `default`
 * drops the `__public_principal__` value Google reports, and a named type
 * arriving without one drops the scope on the same "absent, never wrong"
 * ground as an unknown type.
 */
export function projectAclRule(data: calendar_v3.Schema$AclRule): AclRule {
  return {
    id: data.id ?? '',
    role: narrow(data.role, AclRole.options),
    scope: projectAclScope(narrow(data.scope?.type, AclScopeType.options), data.scope?.value),
  };
}

function projectAclScope(
  type: AclScopeType | undefined,
  value: string | null | undefined,
): AclScope | undefined {
  if (type === undefined) return undefined;
  if (type === 'default') return { type };
  return value === undefined || value === null ? undefined : { type, value };
}
