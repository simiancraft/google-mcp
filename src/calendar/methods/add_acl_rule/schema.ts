import { z } from 'zod';
import { AclRole } from '../../entities/AclRole.js';
import { AclRule } from '../../entities/AclRule.js';
import { AclScope } from '../../entities/AclScope.js';
import { describeRoles } from '../../lib/roles.js';

export const schema = {
  input: z.strictObject({
    role: AclRole.describe(`The role to grant: ${describeRoles()}.`),
    scope: AclScope.describe('Who the role is granted to.'),
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID to share. The default is the user's primary calendar."),
    sendNotifications: z
      .boolean()
      .optional()
      .describe(
        'Whether to send sharing notifications about the change. Google enables them by default, so leaving this unset leaves sharing notifications enabled; pass false to grant access silently.',
      ),
  }),
  output: AclRule,
};
