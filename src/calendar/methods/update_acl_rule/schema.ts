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
        'Whether to send sharing notifications about the change. Google enables them by default, so leaving this unset notifies; pass false to change access silently. Access removal never notifies.',
      ),
  }),
  output: AclRule,
};
