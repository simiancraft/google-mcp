import { z } from 'zod';

/**
 * The extent to which calendar access is granted by an access control rule:
 * who the rule is about.
 *
 * Strict because this entity is composed into write inputs as well as
 * projected into outputs (EXTENDING.md, strict-input rule). The `default`
 * type is the public scope and takes no value; every other type names a
 * principal in `value`.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/acl
 */
export const AclScope = z.strictObject({
  type: z
    .enum(['default', 'user', 'group', 'domain'])
    .describe(
      'The type of the scope: default (the public, meaning any user), user, group, or domain.',
    ),
  value: z
    .string()
    .optional()
    .describe(
      'The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type default, which grants access to the public.',
    ),
});

export type AclScope = z.infer<typeof AclScope>;
