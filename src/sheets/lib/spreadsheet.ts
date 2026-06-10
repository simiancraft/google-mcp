import type { sheets_v4 } from '@googleapis/sheets';
import type { SheetProperties } from '../entities/SheetProperties.js';
import type { Spreadsheet } from '../entities/Spreadsheet.js';
import type { SpreadsheetProperties } from '../entities/SpreadsheetProperties.js';

/** Narrow a REST sheet type onto the entity enum; unknown or unspecified values drop. */
function sheetType(value: string | null | undefined): SheetProperties['sheetType'] {
  return value === 'GRID' || value === 'OBJECT' || value === 'DATA_SOURCE' ? value : undefined;
}

/** Narrow a REST recalculation interval onto the entity enum; unknown values drop. */
function autoRecalc(value: string | null | undefined): SpreadsheetProperties['autoRecalc'] {
  return value === 'ON_CHANGE' || value === 'MINUTE' || value === 'HOUR' ? value : undefined;
}

/** Project REST sheet properties onto the SheetProperties shape, cleaning nulls to undefined. */
export function projectSheetProperties(data: sheets_v4.Schema$SheetProperties): SheetProperties {
  return {
    sheetId: data.sheetId ?? 0,
    title: data.title ?? undefined,
    index: data.index ?? undefined,
    sheetType: sheetType(data.sheetType),
    gridProperties: data.gridProperties
      ? {
          rowCount: data.gridProperties.rowCount ?? undefined,
          columnCount: data.gridProperties.columnCount ?? undefined,
          frozenRowCount: data.gridProperties.frozenRowCount ?? undefined,
          frozenColumnCount: data.gridProperties.frozenColumnCount ?? undefined,
        }
      : undefined,
    hidden: data.hidden ?? undefined,
  };
}

/**
 * Project a REST spreadsheet onto the metadata-only Spreadsheet shape: each
 * `Sheet` flattens to its properties, grid data is never carried, and nulls
 * clean to undefined.
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
          autoRecalc: autoRecalc(data.properties.autoRecalc),
        }
      : undefined,
    sheets: data.sheets
      ? data.sheets.flatMap((sheet) =>
          sheet.properties ? [projectSheetProperties(sheet.properties)] : [],
        )
      : undefined,
  };
}
