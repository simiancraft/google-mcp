import { z } from 'zod';
import { AclRule } from '../../entities/AclRule.js';

export const schema = {
  input: z.strictObject({
    ruleId: z
      .string()
      .describe(
        'The identifier of the access control rule to get, as returned by list_acl_rules (for example "user:someone@example.com").',
      ),
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID the rule belongs to. The default is the user's primary calendar."),
  }),
  output: AclRule,
};
