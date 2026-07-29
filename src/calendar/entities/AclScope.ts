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
 * That pairing is enforced rather than merely documented, because Google
 * ignores a `value` sent with type `default`: without the check, a caller
 * that meant to share with one person and mistyped the scope type would
 * silently publish the calendar to everyone. The refinement rides on top of
 * the strict object, so `.shape` and the emitted JSON Schema (including
 * `additionalProperties: false`) are unchanged.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/sharing
 */
export const AclScope = z
  .strictObject({
    type: z
      .enum(['default', 'user', 'group', 'domain'])
      .describe(
        'The type of the scope: default (the public, meaning any user), user, group, or domain.',
      ),
    value: z
      .string()
      .optional()
      .describe(
        'The email address of a user or group, or the name of a domain, depending on the scope type. Required for user, group, and domain; must be omitted for type default, which grants access to the public.',
      ),
  })
  .refine((scope) => (scope.type === 'default') === (scope.value === undefined), {
    message:
      'scope.value is required for type user, group, and domain, and must be omitted for type default (the public scope)',
    path: ['value'],
  });

export type AclScope = z.infer<typeof AclScope>;
