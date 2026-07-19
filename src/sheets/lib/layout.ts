import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { BandedRange } from '../entities/BandedRange.js';
import type { BandingProperties } from '../entities/BandingProperties.js';
import type { DimensionGroup } from '../entities/DimensionGroup.js';
import type { DimensionProperties } from '../entities/DimensionProperties.js';
import { projectColorStyle, toColorStyle } from './formats.js';
import { projectGridRange } from './rules.js';

/** Carry writable DimensionProperties across the Google boundary. */
export function toDimensionProperties(
  properties: DimensionProperties,
): sheets_v4.Schema$DimensionProperties {
  return forGoogle({
    hiddenByUser: properties.hiddenByUser,
    pixelSize: properties.pixelSize,
  });
}

/** Carry one DimensionRange across the Google boundary. */
export function toDimensionRange(range: DimensionGroup['range']): sheets_v4.Schema$DimensionRange {
  return forGoogle({
    sheetId: range.sheetId,
    dimension: range.dimension,
    startIndex: range.startIndex,
    endIndex: range.endIndex,
  });
}

/** Project a REST DimensionGroup without dropping its position in an ordered group list. */
export function projectDimensionGroup(data: sheets_v4.Schema$DimensionGroup): DimensionGroup {
  return {
    range: {
      sheetId: data.range?.sheetId ?? undefined,
      dimension:
        data.range?.dimension === 'ROWS' || data.range?.dimension === 'COLUMNS'
          ? data.range.dimension
          : undefined,
      startIndex: data.range?.startIndex ?? undefined,
      endIndex: data.range?.endIndex ?? undefined,
    },
    depth: data.depth ?? 0,
    collapsed: data.collapsed ?? undefined,
  };
}

/** Carry BandingProperties across the Google boundary. */
export function toBandingProperties(
  properties: BandingProperties,
): sheets_v4.Schema$BandingProperties {
  return forGoogle({
    headerColorStyle: properties.headerColorStyle
      ? toColorStyle(properties.headerColorStyle)
      : undefined,
    firstBandColorStyle: properties.firstBandColorStyle
      ? toColorStyle(properties.firstBandColorStyle)
      : undefined,
    secondBandColorStyle: properties.secondBandColorStyle
      ? toColorStyle(properties.secondBandColorStyle)
      : undefined,
    footerColorStyle: properties.footerColorStyle
      ? toColorStyle(properties.footerColorStyle)
      : undefined,
  });
}

/** Project REST BandingProperties onto the modern ColorStyle-only shape. */
function projectBandingProperties(data: sheets_v4.Schema$BandingProperties): BandingProperties {
  return {
    headerColorStyle: data.headerColorStyle
      ? projectColorStyle(data.headerColorStyle)
      : data.headerColor
        ? projectColorStyle({ rgbColor: data.headerColor })
        : undefined,
    firstBandColorStyle: data.firstBandColorStyle
      ? projectColorStyle(data.firstBandColorStyle)
      : data.firstBandColor
        ? projectColorStyle({ rgbColor: data.firstBandColor })
        : undefined,
    secondBandColorStyle: data.secondBandColorStyle
      ? projectColorStyle(data.secondBandColorStyle)
      : data.secondBandColor
        ? projectColorStyle({ rgbColor: data.secondBandColor })
        : undefined,
    footerColorStyle: data.footerColorStyle
      ? projectColorStyle(data.footerColorStyle)
      : data.footerColor
        ? projectColorStyle({ rgbColor: data.footerColor })
        : undefined,
  };
}

/** Project a REST banded range without fabricating an ID for reference-only bands. */
export function projectBandedRange(data: sheets_v4.Schema$BandedRange): BandedRange {
  return {
    bandedRangeId: data.bandedRangeId ?? undefined,
    bandedRangeReference: data.bandedRangeReference ?? undefined,
    range: data.range ? projectGridRange(data.range) : undefined,
    rowProperties: data.rowProperties ? projectBandingProperties(data.rowProperties) : undefined,
    columnProperties: data.columnProperties
      ? projectBandingProperties(data.columnProperties)
      : undefined,
  };
}

/** Carry a writable banded range across the Google boundary. */
export function toBandedRange(data: {
  bandedRangeId?: number | undefined;
  range?: BandedRange['range'] | undefined;
  rowProperties?: BandingProperties | undefined;
  columnProperties?: BandingProperties | undefined;
}): sheets_v4.Schema$BandedRange {
  return forGoogle({
    bandedRangeId: data.bandedRangeId,
    range: data.range
      ? forGoogle({
          sheetId: data.range.sheetId,
          startRowIndex: data.range.startRowIndex,
          endRowIndex: data.range.endRowIndex,
          startColumnIndex: data.range.startColumnIndex,
          endColumnIndex: data.range.endColumnIndex,
        })
      : undefined,
    rowProperties: data.rowProperties ? toBandingProperties(data.rowProperties) : undefined,
    columnProperties: data.columnProperties
      ? toBandingProperties(data.columnProperties)
      : undefined,
  });
}
