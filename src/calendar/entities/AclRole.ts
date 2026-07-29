import { z } from 'zod';

/**
 * The level of access an access control rule grants to its scope, from no
 * access at all up to manager access over the calendar's own sharing.
 *
 * `writer` and `writerWithoutPrivateAccess` differ only in what they reveal:
 * both read and write, but the latter hides the details of private events the
 * way `reader` does. `owner` is the escalation to watch, carrying every
 * `writer` permission plus the ability to modify other users' access levels,
 * so a rule granting it hands over control of the calendar's sharing. It is
 * distinct from the calendar's data owner, of which there is exactly one.
 *
 * Ordered least to most access, and sourced from the discovery document
 * rather than the bundled client types, which omit
 * `writerWithoutPrivateAccess`.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/sharing
 */
export const AclRole = z.enum([
  'none',
  'freeBusyReader',
  'reader',
  'writerWithoutPrivateAccess',
  'writer',
  'owner',
]);

export type AclRole = z.infer<typeof AclRole>;
