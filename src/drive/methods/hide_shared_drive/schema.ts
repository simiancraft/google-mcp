import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.object({
    driveId: z.string().describe('The ID of the shared drive.'),
  }),
  output: SharedDrive,
};
