import type { sheets_v4 } from '@googleapis/sheets';
import type { CellValue } from '../entities/CellValue.js';
import type { ValueRange } from '../entities/ValueRange.js';

/** Narrow a REST major dimension onto the entity enum; unspecified values drop. */
function majorDimension(value: string | null | undefined): ValueRange['majorDimension'] {
  return value === 'ROWS' || value === 'COLUMNS' ? value : undefined;
}

/**
 * Project a REST value range onto the ValueRange shape, cleaning nulls to
 * undefined. The grid arrives as JSON scalars (the generated types say
 * `any[][]`); the cast narrows them to the documented CellValue union, and the
 * server's output validation rejects anything else loudly.
 */
export function projectValueRange(data: sheets_v4.Schema$ValueRange): ValueRange {
  return {
    range: data.range ?? undefined,
    majorDimension: majorDimension(data.majorDimension),
    values: data.values ? (data.values as CellValue[][]) : undefined,
  };
}
