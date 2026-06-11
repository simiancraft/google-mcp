import { z } from 'zod';

/**
 * How values are rendered in a read or write response. Shared by every
 * operation that returns cell values.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/ValueRenderOption
 */
export const ValueRenderOption = z
  .enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'])
  .describe(
    'How values should be represented in the output. The default render option is FORMATTED_VALUE.',
  );

export type ValueRenderOption = z.infer<typeof ValueRenderOption>;
