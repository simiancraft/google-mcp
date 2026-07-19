import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';
import { FilterCriteria } from './FilterCriteria.js';
import { GridRange } from './GridRange.js';
import { TextFormat } from './TextFormat.js';

const SlicerTextFormat = TextFormat.omit({ link: true });

/**
 * The range, column, criteria, and presentation of a slicer.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#SlicerSpec
 */
export const SlicerSpec = z.strictObject({
  dataRange: GridRange.optional().describe('The data range of the slicer.'),
  filterCriteria: FilterCriteria.optional().describe('The filtering criteria of the slicer.'),
  columnIndex: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The zero-based column index in the data table to filter.'),
  applyToPivotTables: z
    .boolean()
    .optional()
    .describe('Whether the filter applies to pivot tables; omitted, defaults to true.'),
  title: z.string().optional().describe('The title of the slicer.'),
  textFormat: SlicerTextFormat.optional().describe(
    'The title text format; the link field is not supported.',
  ),
  backgroundColorStyle: ColorStyle.optional().describe('The background color of the slicer.'),
  horizontalAlignment: z
    .enum(['LEFT', 'CENTER', 'RIGHT'])
    .optional()
    .describe('The horizontal title alignment; omitted, defaults to LEFT.'),
});

export type SlicerSpec = z.infer<typeof SlicerSpec>;
