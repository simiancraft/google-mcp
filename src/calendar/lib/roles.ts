import { AclRole } from '../entities/AclRole.js';

/**
 * What each access role actually grants, in one clause, sourced from Google's
 * calendar-sharing concepts page.
 *
 * Keyed by `AclRole`, so adding a role to the enum without describing it here
 * is a compile error rather than prose that silently goes stale. That matters
 * because the vocabulary is restated on four agent-facing surfaces, and the
 * last role Google added reached the enum while every description kept the old
 * list.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/sharing
 */
const ROLE_GLOSS: Record<AclRole, string> = {
  none: 'no access',
  freeBusyReader: 'free/busy only',
  reader: 'event details, with private events hidden',
  writerWithoutPrivateAccess:
    'read and write only the events that are not private, seeing private ones as busy blocks',
  writer: "read and write everything, plus read access to the calendar's own sharing",
  owner: "everything writer grants, plus the ability to change other users' access",
};

/** `none, freeBusyReader, reader, ...`: the bare vocabulary, in order. */
export function listRoles(roles: readonly AclRole[] = AclRole.options): string {
  return roles.join(', ');
}

/** `none (no access), freeBusyReader (free/busy only), ...`: each role glossed. */
export function describeRoles(roles: readonly AclRole[] = AclRole.options): string {
  const described = roles.map((role) => `${role} (${ROLE_GLOSS[role]})`);
  const last = described.pop();
  return described.length > 0 ? `${described.join(', ')}, or ${last}` : `${last}`;
}

/**
 * The roles that can appear as an effective `accessRole` on a calendar you can
 * already see. `none` cannot: a calendar on your list grants at least
 * free/busy.
 */
export const EFFECTIVE_ROLES: readonly AclRole[] = AclRole.options.filter(
  (role) => role !== 'none',
);
