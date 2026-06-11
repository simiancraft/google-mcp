import { z } from 'zod';
import { About } from '../../entities/About.js';

export const schema = {
  input: z.object({}),
  output: About,
};
