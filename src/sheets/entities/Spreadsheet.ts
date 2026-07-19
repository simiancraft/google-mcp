import { z } from 'zod';
import { BandedRange } from './BandedRange.js';
import { BasicFilterReadout } from './BasicFilter.js';
import { ConditionalFormatRuleReadout } from './ConditionalFormatRuleReadout.js';
import { DimensionGroup } from './DimensionGroup.js';
import { FilterViewReadout } from './FilterView.js';
import { GridRange } from './GridRange.js';
import { NamedRange } from './NamedRange.js';
import { ProtectedRange } from './ProtectedRange.js';
import { SheetProperties } from './SheetProperties.js';
import { Slicer } from './Slicer.js';
import { SpreadsheetProperties } from './SpreadsheetProperties.js';

/**
 * One sheet (tab) in the Spreadsheet projection: its properties, flattened,
 * plus the sheet-level collections (filters, protected ranges, conditional
 * format rules, banded ranges, dimension groups, slicers, merged ranges). Grid
 * data is still never carried.
 */
const Sheet = SheetProperties.extend({
  basicFilter: BasicFilterReadout.optional().describe(
    'The basic filter on this sheet, if one exists; its range, sort specifications, and per-column filter specifications.',
  ),
  filterViews: z
    .array(FilterViewReadout)
    .optional()
    .describe(
      'The filter views on this sheet; absent when there are none. Each carries the filterViewId used as update_filter_view.filterViewId and as duplicate_filter_view/delete_filter_view.filterId.',
    ),
  protectedRanges: z
    .array(ProtectedRange)
    .optional()
    .describe(
      'The protected ranges on this sheet; absent when there are none. Each carries the protectedRangeId that update_protected_range and delete_protected_range take.',
    ),
  conditionalFormats: z
    .array(ConditionalFormatRuleReadout)
    .optional()
    .describe(
      'The conditional format rules on this sheet, in rule order; absent when there are none. The array index is the index that update_conditional_format_rule, move_conditional_format_rule, and delete_conditional_format_rule take.',
    ),
  bandedRanges: z
    .array(BandedRange)
    .optional()
    .describe(
      'The banded ranges on this sheet; absent when there are none. A readout can carry bandedRangeId, used by update_banding and delete_banding, or bandedRangeReference when an ID is not supported.',
    ),
  rowGroups: z
    .array(DimensionGroup)
    .optional()
    .describe(
      'All row groups on this sheet, ordered by increasing range start index and then group depth. Groups have no ID; update_dimension_group selects by range and depth, while delete_dimension_group takes a range.',
    ),
  columnGroups: z
    .array(DimensionGroup)
    .optional()
    .describe(
      'All column groups on this sheet, ordered by increasing range start index and then group depth. Groups have no ID; update_dimension_group selects by range and depth, while delete_dimension_group takes a range.',
    ),
  slicers: z
    .array(Slicer)
    .optional()
    .describe(
      'The slicers on this sheet; absent when there are none. Each carries the slicerId used by update_slicer_spec.',
    ),
  merges: z
    .array(GridRange)
    .optional()
    .describe(
      'The merged ranges on this sheet; absent when there are none. Each merge renders only its upper-left value.',
    ),
});

/**
 * A spreadsheet: the top-level container, identified by `spreadsheetId`, holding
 * properties and one or more sheets. This projection carries metadata and the
 * sheet-level collections (filters, protected ranges, conditional format
 * rules, banded ranges, ordered dimension groups, slicers, merged ranges); grid data
 * (per-cell formatting, validation, notes) is never carried, cell values flow
 * through the values operations as plain 2D
 * arrays, and update_cells writes structured cell content.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet
 * @see https://developers.google.com/workspace/sheets/api/guides/concepts
 */
export const Spreadsheet = z.object({
  spreadsheetId: z.string().describe('The ID of the spreadsheet.'),
  spreadsheetUrl: z.string().optional().describe('The url of the spreadsheet.'),
  properties: SpreadsheetProperties.optional().describe('Overall properties of the spreadsheet.'),
  sheets: z
    .array(Sheet)
    .optional()
    .describe(
      'Each sheet (tab) in the spreadsheet, in tab order: its properties plus its basic filter, filter views, protected ranges, conditional format rules, banded ranges, ordered row and column groups, slicers, and merged ranges.',
    ),
  namedRanges: z
    .array(NamedRange)
    .optional()
    .describe('The named ranges defined in the spreadsheet; absent when there are none.'),
});

export type Spreadsheet = z.infer<typeof Spreadsheet>;
