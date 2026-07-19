import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { CellData } from '../entities/CellData.js';
import type { ExtendedValue } from '../entities/ExtendedValue.js';
import type { TextFormatRun } from '../entities/TextFormatRun.js';
import { toCellFormat, toTextFormat } from './formats.js';

/**
 * Cell-content carriers: `update_cells`' nouns crossing the Google boundary,
 * with `forGoogle` at each level and the documented oneof enforced here,
 * once, like formats.ts's `toColorStyle`.
 */

/**
 * Carry an ExtendedValue across the Google boundary. Enforces the
 * documented oneof: a cell value is at most one of the four kinds, and an
 * empty value clears the cell's value under the mask.
 */
export function toExtendedValue(value: ExtendedValue): sheets_v4.Schema$ExtendedValue {
  const provided = [value.stringValue, value.numberValue, value.boolValue, value.formulaValue];
  if (provided.filter((kind) => kind !== undefined).length > 1) {
    throw new Error(
      'Provide at most one of stringValue, numberValue, boolValue, or formulaValue in a cell value.',
    );
  }
  return forGoogle({
    stringValue: value.stringValue,
    numberValue: value.numberValue,
    boolValue: value.boolValue,
    formulaValue: value.formulaValue,
  });
}

/** Carry a TextFormatRun across the Google boundary. */
export function toTextFormatRun(run: TextFormatRun): sheets_v4.Schema$TextFormatRun {
  return forGoogle({
    startIndex: run.startIndex,
    format: toTextFormat(run.format),
  });
}

/** Carry a CellData across the Google boundary. */
export function toCellData(cell: CellData): sheets_v4.Schema$CellData {
  return forGoogle({
    userEnteredValue: cell.userEnteredValue ? toExtendedValue(cell.userEnteredValue) : undefined,
    note: cell.note,
    userEnteredFormat: cell.userEnteredFormat ? toCellFormat(cell.userEnteredFormat) : undefined,
    textFormatRuns: cell.textFormatRuns ? cell.textFormatRuns.map(toTextFormatRun) : undefined,
  });
}
