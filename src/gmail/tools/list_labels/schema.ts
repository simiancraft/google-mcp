import { z } from 'zod';
import { Label } from '../../entities/Label.js';

export const schema = {
  input: z.object({
    pageSize: z.number().int().optional(),
    pageToken: z.string().optional(),
  }),
  output: z.object({
    labels: z.array(Label),
    nextPageToken: z.string().optional(),
  }),
};
