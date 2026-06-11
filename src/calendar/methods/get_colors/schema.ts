import { z } from 'zod';
import { Colors } from '../../entities/Colors.js';

export const schema = {
  input: z.object({}),
  output: Colors,
};
