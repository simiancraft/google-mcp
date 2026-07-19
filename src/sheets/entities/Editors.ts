import { z } from 'zod';

/**
 * The users and groups with edit access to a protected range. Editors are
 * not supported with warning-only protection.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#Editors
 */
export const Editors = z.strictObject({
  users: z
    .array(z.string())
    .optional()
    .describe('The email addresses of users with edit access to the protected range.'),
  groups: z
    .array(z.string())
    .optional()
    .describe('The email addresses of groups with edit access to the protected range.'),
  domainUsersCanEdit: z
    .boolean()
    .optional()
    .describe(
      "True if anyone in the document's domain has edit access to the protected range; domain protection is only supported on documents within a domain.",
    ),
});

export type Editors = z.infer<typeof Editors>;
