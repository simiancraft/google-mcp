import { z } from 'zod';
import { AclRole } from '../../entities/AclRole.js';
import { AclRule } from '../../entities/AclRule.js';
import { AclScope } from '../../entities/AclScope.js';

export const schema = {
  input: z.strictObject({
    ruleId: z
      .string()
      .describe(
        'The identifier of the rule to replace, as returned by list_acl_rules (for example "user:someone@example.com").',
      ),
    role: AclRole.optional().describe(
      'The role the rule grants after the replacement. Optional: the discovery document marks role required for acl.insert only, not for acl.update.',
    ),
    scope: AclScope.describe(
      'Who the role is granted to. A rule id derives from its scope, so this must agree with ruleId.',
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
