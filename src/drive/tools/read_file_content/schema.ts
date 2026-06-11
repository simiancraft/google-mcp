import { z } from 'zod';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file to retrieve.'),
  }),
  output: z.object({
    fileContent: z.string().describe('Drive file content returned in text format.'),
  }),
};
