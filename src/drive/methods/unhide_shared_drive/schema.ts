import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.strictObject({
    driveId: z.string().describe('The ID of the shared drive.'),
  }),
  output: SharedDrive,
};
