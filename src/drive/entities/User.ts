import { z } from 'zod';

/**
 * A Drive user as surfaced on comments, replies, and revisions (the author
 * and last-modifying-user fields). Drive does not populate the author's email
 * address on comments and replies.
 *
 * @see https://developers.google.com/workspace/drive/api/reference/rest/v3/User
 */
export const User = z.object({
  displayName: z
    .string()
    .optional()
    .describe('Output only. A plain text displayable name for this user.'),
  emailAddress: z
    .string()
    .optional()
    .describe(
      'Output only. The email address of the user. This may not be present in certain ' +
        'contexts if the user has not made their email address visible to the requester.',
    ),
  me: z.boolean().optional().describe('Output only. Whether this user is the requesting user.'),
  photoLink: z
    .string()
    .optional()
    .describe("Output only. A link to the user's profile photo, if available."),
});

export type User = z.infer<typeof User>;
