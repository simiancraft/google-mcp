import { z } from 'zod';

export const schema = {
  input: z.object({
    driveId: z
      .string()
      .optional()
      .describe('If set, empties the trash of the provided shared drive.'),
  }),
  /** Empty trash returns no body; we confirm completion. */
  output: z.object({
    emptied: z.literal(true).describe('The trash was emptied.'),
  }),
};
