import { z } from 'zod';
import { Setting } from '../../entities/Setting.js';

export const schema = {
  input: z.object({
    settingId: z
      .string()
      .describe('The id of the user setting to get, for example timezone or weekStart.'),
  }),
  output: Setting,
};
