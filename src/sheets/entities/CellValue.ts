import { z } from 'zod';

/**
 * One cell's value as it crosses the JSON wire: a string, number, boolean, or
 * null, depending on the cell contents and the request's render options
 * (`FORMATTED_VALUE` renders strings; `UNFORMATTED_VALUE` preserves numbers and
 * booleans; `FORMULA` renders the entered formula as a string). The REST docs
 * model this as `ExtendedValue`; on the wire it is always a JSON scalar.
 *
 * @see https://sheets.googleapis.com/$discovery/rest?version=v4 (schemas.ValueRange.values)
 * @see https://developers.google.com/workspace/sheets/api/guides/concepts#cell
 */
export const CellValue = z
  .union([z.string(), z.number(), z.boolean(), z.null()])
  .describe('One cell value: a string, number, boolean, or null.');

export type CellValue = z.infer<typeof CellValue>;
