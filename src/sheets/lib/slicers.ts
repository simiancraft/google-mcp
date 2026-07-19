import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import { narrow } from '../../lib/utils/narrow.js';
import type { EmbeddedObjectPosition } from '../entities/EmbeddedObjectPosition.js';
import type { Slicer } from '../entities/Slicer.js';
import { SlicerSpec } from '../entities/SlicerSpec.js';
import { projectEmbeddedObjectPosition, toEmbeddedObjectPosition } from './charts.js';
import { projectFilterCriteria, toFilterCriteria } from './filtering.js';
import { projectColorStyle, projectTextFormat, toColorStyle, toTextFormat } from './formats.js';
import { projectGridRange } from './rules.js';

/** Carry a slicer specification across the Google boundary. */
export function toSlicerSpec(spec: SlicerSpec): sheets_v4.Schema$SlicerSpec {
  return forGoogle({
    dataRange: spec.dataRange ? forGoogle(spec.dataRange) : undefined,
    filterCriteria: spec.filterCriteria ? toFilterCriteria(spec.filterCriteria) : undefined,
    columnIndex: spec.columnIndex,
    applyToPivotTables: spec.applyToPivotTables,
    title: spec.title,
    textFormat: spec.textFormat ? toTextFormat(spec.textFormat) : undefined,
    backgroundColorStyle: spec.backgroundColorStyle
      ? toColorStyle(spec.backgroundColorStyle)
      : undefined,
    horizontalAlignment: spec.horizontalAlignment,
  });
}

/** Carry a slicer add payload across the Google boundary. */
export function toSlicer(slicer: {
  slicerId?: number | undefined;
  spec: SlicerSpec;
  position: EmbeddedObjectPosition;
}): sheets_v4.Schema$Slicer {
  if (
    slicer.position.overlayPosition === undefined ||
    slicer.position.sheetId !== undefined ||
    slicer.position.newSheet !== undefined
  ) {
    throw new Error('Provide only position.overlayPosition when adding a slicer.');
  }
  if (slicer.position.overlayPosition.anchorCell === undefined) {
    throw new Error('Provide position.overlayPosition.anchorCell when adding a slicer.');
  }
  return forGoogle({
    slicerId: slicer.slicerId,
    spec: toSlicerSpec(slicer.spec),
    position: toEmbeddedObjectPosition(slicer.position),
  });
}

/** Project a REST slicer specification, cleaning nulls and deprecated colors. */
export function projectSlicerSpec(data: sheets_v4.Schema$SlicerSpec): SlicerSpec {
  const textFormat = data.textFormat ? projectTextFormat(data.textFormat) : undefined;
  if (textFormat) Reflect.deleteProperty(textFormat, 'link');
  return {
    dataRange: data.dataRange ? projectGridRange(data.dataRange) : undefined,
    filterCriteria: data.filterCriteria ? projectFilterCriteria(data.filterCriteria) : undefined,
    columnIndex: data.columnIndex ?? undefined,
    applyToPivotTables: data.applyToPivotTables ?? undefined,
    title: data.title ?? undefined,
    textFormat,
    backgroundColorStyle: data.backgroundColorStyle
      ? projectColorStyle(data.backgroundColorStyle)
      : data.backgroundColor
        ? projectColorStyle({ rgbColor: data.backgroundColor })
        : undefined,
    horizontalAlignment: narrow(
      data.horizontalAlignment,
      SlicerSpec.shape.horizontalAlignment.unwrap().options,
    ),
  };
}

/** Project a REST slicer readout and keep its identity total. */
export function projectSlicer(data: sheets_v4.Schema$Slicer): Slicer {
  return {
    slicerId: data.slicerId ?? 0,
    spec: data.spec ? projectSlicerSpec(data.spec) : undefined,
    position: data.position ? projectEmbeddedObjectPosition(data.position) : undefined,
  };
}
