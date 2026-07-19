import { z } from 'zod';

/**
 * Whether an operation applies to rows or columns.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/Dimension
 */
export const Dimension = z.enum(['ROWS', 'COLUMNS']);

export type Dimension = z.infer<typeof Dimension>;
