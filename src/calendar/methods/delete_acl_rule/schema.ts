import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    ruleId: z
      .string()
      .describe(
        'The identifier of the rule to revoke, as returned by list_acl_rules (for example "user:someone@example.com").',
      ),
    calendarId: z
      .string()
      .optional()
      .describe("The calendar ID the rule belongs to. The default is the user's primary calendar."),
  }),
  /** Delete returns no body; we confirm what was revoked. */
  output: z.object({
    ruleId: z.string().describe('The ID of the revoked rule.'),
    calendarId: z.string().describe('The ID of the calendar the rule was revoked from.'),
  }),
};
