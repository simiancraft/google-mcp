import { z } from 'zod';

/**
 * How dates, times, and durations are rendered in a read or write response.
 * Shared by every operation that returns cell values.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/DateTimeRenderOption
 */
export const DateTimeRenderOption = z
  .enum(['SERIAL_NUMBER', 'FORMATTED_STRING'])
  .describe(
    'How dates, times, and durations should be rendered in the output. Ignored when the value render option is FORMATTED_VALUE; the default is SERIAL_NUMBER.',
  );

export type DateTimeRenderOption = z.infer<typeof DateTimeRenderOption>;
