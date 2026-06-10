import { z } from 'zod';
import { Colors } from '../../entities/Colors.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/colors/get */
export const schema = {
  input: z.object({}),
  output: Colors,
};
