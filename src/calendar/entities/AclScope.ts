import { z } from 'zod';

/**
 * The kinds of principal a sharing rule can name.
 *
 * Exported separately from AclScope because AclScope is a union and so has no
 * single `shape` to read the type list from; the projection narrows against
 * this (EXTENDING.md, "Enum policy": the allowed list derives from the entity).
 */
export const AclScopeType = z.enum(['default', 'user', 'group', 'domain']);

export type AclScopeType = z.infer<typeof AclScopeType>;

/**
 * The extent to which calendar access is granted by an access control rule:
 * who the rule is about.
 *
 * A discriminated union rather than one object with an optional `value`,
 * because the two shapes genuinely differ: `default` is the public scope and
 * takes no value, while `user`, `group`, and `domain` each name a principal
 * and require one. Modeling it as a union is what makes the emitted JSON
 * Schema (`oneOf`, each branch with its own `required`) match what the server
 * actually accepts; a refinement would validate at runtime but advertise the
 * wider shape to every MCP client, so an agent would build a call the schema
 * told it was legal and then be rejected.
 *
 * The pairing is enforced rather than merely documented because Google does
 * not enforce it, and its failure mode is severe: sending a value alongside
 * type `default` is accepted, the value is discarded for
 * `__public_principal__`, and the calendar becomes public. Verified against
 * the live API, not inferred.
 *
 * Both branches are strict, per EXTENDING.md's strict-input rule.
 *
 * @see https://developers.google.com/workspace/calendar/api/concepts/sharing
 */
export const AclScope = z.discriminatedUnion('type', [
  z.strictObject({
    type: z
      .literal('default')
      .describe('The public scope: access is granted to any user, authenticated or not.'),
  }),
  z.strictObject({
    type: z
      .enum(['user', 'group', 'domain'])
      .describe('The type of the scope: a single user, a group, or a whole domain.'),
    value: z
      .string()
      .describe(
        'The email address of a user or group, or the name of a domain, depending on the scope type.',
      ),
  }),
]);

export type AclScope = z.infer<typeof AclScope>;
