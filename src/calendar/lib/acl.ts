import type { calendar_v3 } from '@googleapis/calendar';
import { narrow } from '../../lib/utils/narrow.js';
import { AclRole } from '../entities/AclRole.js';
import type { AclRule } from '../entities/AclRule.js';
import { AclScope } from '../entities/AclScope.js';

/**
 * Project a REST ACL rule onto the AclRule shape, cleaning nulls to
 * undefined and narrowing the output enums (EXTENDING.md, "Enum policy").
 *
 * `scope.type` is required within AclScope, so an unrecognized type drops the
 * whole scope rather than emitting a scope with a missing type: the field goes
 * absent instead of the object going malformed. A caller that sees a rule with
 * a role but no scope is looking at a scope type this surface predates.
 *
 * The scope is normalized to AclScope's type/value pairing so a projection can
 * never produce a rule that fails its own schema: `default` drops any value
 * Google echoed back, and a named type arriving without one drops the scope on
 * the same "absent, never wrong" ground as an unknown type.
 */
export function projectAclRule(data: calendar_v3.Schema$AclRule): AclRule {
  const scopeType = narrow(data.scope?.type, AclScope.shape.type.options);
  const scopeValue = data.scope?.value ?? undefined;
  return {
    id: data.id ?? '',
    role: narrow(data.role, AclRole.options),
    scope: projectAclScope(scopeType, scopeValue),
  };
}

function projectAclScope(
  type: AclScope['type'] | undefined,
  value: string | undefined,
): AclScope | undefined {
  if (type === undefined) return undefined;
  if (type === 'default') return { type };
  return value === undefined ? undefined : { type, value };
}
