import { z } from 'zod';

/**
 * Which way a 2D grid of values is oriented: each inner array is one row
 * (ROWS) or one column (COLUMNS). Shared by every values operation.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/Dimension
 */
export const MajorDimension = z
  .enum(['ROWS', 'COLUMNS'])
  .describe(
    'The major dimension of the values: each inner array is one row (ROWS) or one column (COLUMNS). Defaults to ROWS.',
  );

export type MajorDimension = z.infer<typeof MajorDimension>;
