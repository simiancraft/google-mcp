import type { docs_v1 } from '@googleapis/docs';
import { forGoogle } from '../../lib/optionality.js';
import type { Location } from '../entities/Location.js';
import type { Range } from '../entities/Range.js';
import type { TableCellLocation } from '../entities/TableCellLocation.js';
import type { TableRange } from '../entities/TableRange.js';

/**
 * The wire adapters for the addressing entities, shared by every handler
 * that sends a Range or Location (or the table shapes nesting one). Their
 * `segmentId` is explicitly optional (`Optional<string>`), and `forGoogle`
 * is shallow, so each nesting depth reconciles here once instead of at
 * every call site; like `pt()` and `optionalColor()`, undefined passes
 * through for the optional-location operations.
 */
export function range(value: Range): docs_v1.Schema$Range;
export function range(value: undefined): undefined;
export function range(value: Range | undefined): docs_v1.Schema$Range | undefined;
export function range(value: Range | undefined): docs_v1.Schema$Range | undefined {
  return value === undefined ? undefined : forGoogle(value);
}

export function location(value: Location): docs_v1.Schema$Location;
export function location(value: undefined): undefined;
export function location(value: Location | undefined): docs_v1.Schema$Location | undefined;
export function location(value: Location | undefined): docs_v1.Schema$Location | undefined {
  return value === undefined ? undefined : forGoogle(value);
}

export function tableCellLocation(value: TableCellLocation): docs_v1.Schema$TableCellLocation;
export function tableCellLocation(value: undefined): undefined;
export function tableCellLocation(
  value: TableCellLocation | undefined,
): docs_v1.Schema$TableCellLocation | undefined;
export function tableCellLocation(
  value: TableCellLocation | undefined,
): docs_v1.Schema$TableCellLocation | undefined {
  return value === undefined
    ? undefined
    : { ...value, tableStartLocation: location(value.tableStartLocation) };
}

export function tableRange(value: TableRange): docs_v1.Schema$TableRange;
export function tableRange(value: undefined): undefined;
export function tableRange(value: TableRange | undefined): docs_v1.Schema$TableRange | undefined;
export function tableRange(value: TableRange | undefined): docs_v1.Schema$TableRange | undefined {
  return value === undefined
    ? undefined
    : { ...value, tableCellLocation: tableCellLocation(value.tableCellLocation) };
}
