import { z } from 'zod';
import { AclRole } from '../../entities/AclRole.js';
import { AclRule } from '../../entities/AclRule.js';
import { AclScope } from '../../entities/AclScope.js';

export const schema = {
  input: z.strictObject({
    role: AclRole.describe(
      "The role to grant: none, freeBusyReader (free/busy only), reader (event details, private events hidden), writerWithoutPrivateAccess (read and write only the events that are not private, seeing private ones as busy blocks), writer (read and write everything, including private event details, plus read access to the calendar's own sharing), or owner (writer plus the ability to change other users' access).",
    ),
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
