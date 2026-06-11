import { z } from 'zod';
import { Permission } from '../../entities/Permission.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file to get permissions for.'),
  }),
  output: z.object({
    permissions: z.array(Permission).describe('The list of permissions.'),
  }),
};
