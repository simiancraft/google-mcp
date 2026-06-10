import { z } from 'zod';

/**
 * One user setting, for example timezone, weekStart, or format24HourTime.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/settings
 */
export const Setting = z.object({
  id: z.string().describe('The id of the user setting.'),
  value: z
    .string()
    .describe('Value of the user setting; the format of the value depends on the setting id.'),
});

export type Setting = z.infer<typeof Setting>;
