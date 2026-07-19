import type { sheets_v4 } from '@googleapis/sheets';
import { narrow } from '../../lib/utils/narrow.js';
import type { ConditionalFormatRuleReadout } from '../entities/ConditionalFormatRuleReadout.js';
import type { NamedRange } from '../entities/NamedRange.js';
import { SheetProperties } from '../entities/SheetProperties.js';
import type { Spreadsheet } from '../entities/Spreadsheet.js';
import { SpreadsheetProperties } from '../entities/SpreadsheetProperties.js';
import { projectBasicFilter, projectFilterView } from './filtering.js';
import { projectColorStyle } from './formats.js';
import { projectBandedRange, projectDimensionGroup } from './layout.js';
import { projectGridRange, projectProtectedRange } from './rules.js';

/** Project REST sheet properties onto the SheetProperties shape, cleaning nulls to undefined. */
export function projectSheetProperties(data: sheets_v4.Schema$SheetProperties): SheetProperties {
  return {
    sheetId: data.sheetId ?? 0,
    title: data.title ?? undefined,
    index: data.index ?? undefined,
    sheetType: narrow(data.sheetType, SheetProperties.shape.sheetType.unwrap().options),
    gridProperties: data.gridProperties
      ? {
          rowCount: data.gridProperties.rowCount ?? undefined,
          columnCount: data.gridProperties.columnCount ?? undefined,
          frozenRowCount: data.gridProperties.frozenRowCount ?? undefined,
          frozenColumnCount: data.gridProperties.frozenColumnCount ?? undefined,
        }
      : undefined,
    hidden: data.hidden ?? undefined,
    tabColorStyle: data.tabColorStyle ? projectColorStyle(data.tabColorStyle) : undefined,
  };
}

/** Project a REST named range onto the NamedRange shape, cleaning nulls to undefined. */
export function projectNamedRange(data: sheets_v4.Schema$NamedRange): NamedRange {
  return {
    namedRangeId: data.namedRangeId ?? undefined,
    name: data.name ?? undefined,
    range: data.range
      ? {
          sheetId: data.range.sheetId ?? undefined,
          startRowIndex: data.range.startRowIndex ?? undefined,
          endRowIndex: data.range.endRowIndex ?? undefined,
          startColumnIndex: data.range.startColumnIndex ?? undefined,
          endColumnIndex: data.range.endColumnIndex ?? undefined,
        }
      : undefined,
  };
}

/** Project a REST color style onto the open readout shape (no theme narrowing; the readout must be total). */
function projectColorStyleReadout(data: sheets_v4.Schema$ColorStyle) {
  return {
    rgbColor: data.rgbColor
      ? {
          red: data.rgbColor.red ?? undefined,
          green: data.rgbColor.green ?? undefined,
          blue: data.rgbColor.blue ?? undefined,
        }
      : undefined,
    themeColor: data.themeColor ?? undefined,
  };
}

/** Project an interpolation point, falling back to the deprecated `color` field for old sheets. */
function projectInterpolationPoint(data: sheets_v4.Schema$InterpolationPoint) {
  return {
    colorStyle: data.colorStyle
      ? projectColorStyleReadout(data.colorStyle)
      : data.color
        ? projectColorStyleReadout({ rgbColor: data.color })
        : undefined,
    type: data.type ?? undefined,
    value: data.value ?? undefined,
  };
}

/**
 * Project a REST conditional format rule onto the open readout shape. Total
 * by design: rules are addressed by array index, so every rule projects
 * (type fields stay open strings rather than narrowed enums) and none is
 * ever dropped, or every rule after it would silently renumber.
 */
export function projectConditionalFormatRule(
  data: sheets_v4.Schema$ConditionalFormatRule,
): ConditionalFormatRuleReadout {
  return {
    ranges: data.ranges ? data.ranges.map(projectGridRange) : undefined,
    booleanRule: data.booleanRule
      ? {
          condition: data.booleanRule.condition
            ? {
                type: data.booleanRule.condition.type ?? undefined,
                values: data.booleanRule.condition.values
                  ? data.booleanRule.condition.values.map((value) => ({
                      userEnteredValue: value.userEnteredValue ?? undefined,
                      relativeDate: value.relativeDate ?? undefined,
                    }))
                  : undefined,
              }
            : undefined,
          format: data.booleanRule.format
            ? {
                // Legacy sheets may carry only the deprecated color fields;
                // fall back like the interpolation-point projection does.
                backgroundColorStyle: data.booleanRule.format.backgroundColorStyle
                  ? projectColorStyleReadout(data.booleanRule.format.backgroundColorStyle)
                  : data.booleanRule.format.backgroundColor
                    ? projectColorStyleReadout({
                        rgbColor: data.booleanRule.format.backgroundColor,
                      })
                    : undefined,
                textFormat: data.booleanRule.format.textFormat
                  ? {
                      foregroundColorStyle: data.booleanRule.format.textFormat.foregroundColorStyle
                        ? projectColorStyleReadout(
                            data.booleanRule.format.textFormat.foregroundColorStyle,
                          )
                        : data.booleanRule.format.textFormat.foregroundColor
                          ? projectColorStyleReadout({
                              rgbColor: data.booleanRule.format.textFormat.foregroundColor,
                            })
                          : undefined,
                      bold: data.booleanRule.format.textFormat.bold ?? undefined,
                      italic: data.booleanRule.format.textFormat.italic ?? undefined,
                      strikethrough: data.booleanRule.format.textFormat.strikethrough ?? undefined,
                    }
                  : undefined,
              }
            : undefined,
        }
      : undefined,
    gradientRule: data.gradientRule
      ? {
          minpoint: data.gradientRule.minpoint
            ? projectInterpolationPoint(data.gradientRule.minpoint)
            : undefined,
          midpoint: data.gradientRule.midpoint
            ? projectInterpolationPoint(data.gradientRule.midpoint)
            : undefined,
          maxpoint: data.gradientRule.maxpoint
            ? projectInterpolationPoint(data.gradientRule.maxpoint)
            : undefined,
        }
      : undefined,
  };
}

/**
 * Project a REST spreadsheet onto the Spreadsheet shape: each `Sheet`
 * flattens to its properties plus its sheet-level collections (filters,
 * protected ranges, conditional format rules, banded ranges, ordered dimension
 * groups, merged ranges), grid data is never carried, and nulls clean to undefined.
 */
export function projectSpreadsheet(data: sheets_v4.Schema$Spreadsheet): Spreadsheet {
  return {
    spreadsheetId: data.spreadsheetId ?? '',
    spreadsheetUrl: data.spreadsheetUrl ?? undefined,
    properties: data.properties
      ? {
          title: data.properties.title ?? undefined,
          locale: data.properties.locale ?? undefined,
          timeZone: data.properties.timeZone ?? undefined,
          autoRecalc: narrow(
            data.properties.autoRecalc,
            SpreadsheetProperties.shape.autoRecalc.unwrap().options,
          ),
        }
      : undefined,
    sheets: data.sheets
      ? data.sheets.flatMap((sheet) =>
          sheet.properties
            ? [
                {
                  ...projectSheetProperties(sheet.properties),
                  basicFilter: sheet.basicFilter
                    ? projectBasicFilter(sheet.basicFilter)
                    : undefined,
                  filterViews: sheet.filterViews
                    ? sheet.filterViews.map(projectFilterView)
                    : undefined,
                  protectedRanges: sheet.protectedRanges
                    ? sheet.protectedRanges.map(projectProtectedRange)
                    : undefined,
                  conditionalFormats: sheet.conditionalFormats
                    ? sheet.conditionalFormats.map(projectConditionalFormatRule)
                    : undefined,
                  bandedRanges: sheet.bandedRanges
                    ? sheet.bandedRanges.map(projectBandedRange)
                    : undefined,
                  rowGroups: sheet.rowGroups
                    ? sheet.rowGroups.map(projectDimensionGroup)
                    : undefined,
                  columnGroups: sheet.columnGroups
                    ? sheet.columnGroups.map(projectDimensionGroup)
                    : undefined,
                  merges: sheet.merges ? sheet.merges.map(projectGridRange) : undefined,
                },
              ]
            : [],
        )
      : undefined,
    namedRanges: data.namedRanges ? data.namedRanges.map(projectNamedRange) : undefined,
  };
}
