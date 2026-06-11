import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.strictObject({
    name: z.string().describe('The name of the shared drive to create.'),
    requestId: z
      .string()
      .optional()
      .describe(
        "An ID, such as a random UUID, which uniquely identifies this user's request for " +
          'idempotent creation of a shared drive: a repeated request with the same ID ' +
          'returns a 409 instead of creating a duplicate. Defaults to a random UUID.',
      ),
  }),
  output: SharedDrive,
};
