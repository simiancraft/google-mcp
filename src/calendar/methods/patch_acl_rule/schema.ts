import { z } from 'zod';
import { AclRole } from '../../entities/AclRole.js';
import { AclRule } from '../../entities/AclRule.js';
import { AclScope } from '../../entities/AclScope.js';

export const schema = {
  input: z.strictObject({
    ruleId: z
      .string()
      .describe(
        'The identifier of the rule to update, as returned by list_acl_rules (for example "user:someone@example.com").',
      ),
    role: AclRole.optional().describe('The new role the rule grants; left unchanged when unset.'),
    scope: AclScope.optional().describe(
      'The new scope the role is granted to; left unchanged when unset. A rule id derives from its scope, so changing it is rarely what is wanted.',
    ),
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID the rule belongs to. The default is the user's primary calendar."),
    sendNotifications: z
      .boolean()
      .optional()
      .describe(
        'Whether to email the grantee about the sharing change. Google defaults this to true, so leaving it unset sends mail to the scope; pass false to change access silently. There is never a notification on access removal.',
      ),
  }),
  output: AclRule,
};
