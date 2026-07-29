import { z } from 'zod';

/**
 * The level of access an access control rule grants to its scope, from no
 * access at all up to manager access over the calendar's own sharing.
 *
 * `owner` is the escalation to watch: it carries every `writer` permission
 * plus the ability to modify other users' access levels, so a rule granting
 * it hands over control of the calendar's sharing. It is distinct from the
 * calendar's data owner, of which there is exactly one.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/acl
 */
export const AclRole = z.enum(['none', 'freeBusyReader', 'reader', 'writer', 'owner']);

export type AclRole = z.infer<typeof AclRole>;
