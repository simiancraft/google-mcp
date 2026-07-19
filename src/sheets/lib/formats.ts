import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { Border } from '../entities/Border.js';
import type { CellFormat } from '../entities/CellFormat.js';
import type { ColorStyle } from '../entities/ColorStyle.js';
import type { TextFormat } from '../entities/TextFormat.js';

/**
 * Format-noun carriers: the request-direction mirror of spreadsheet.ts's
 * projections, taking documented entities across the Google boundary with
 * `forGoogle` at each level (see optionality.ts). Each carrier enumerates its
 * entity's fields by hand, so a field added to an entity without a carrier
 * line compiles unchanged and silently drops at the boundary; the handler
 * tests' exact-params assertions are the guard, so extend them with the field.
 */

/** Carry a ColorStyle across the Google boundary. */
export function toColorStyle(colorStyle: ColorStyle): sheets_v4.Schema$ColorStyle {
  return forGoogle({
    rgbColor: colorStyle.rgbColor ? forGoogle(colorStyle.rgbColor) : undefined,
    themeColor: colorStyle.themeColor,
  });
}

/** Carry a TextFormat across the Google boundary. */
export function toTextFormat(textFormat: TextFormat): sheets_v4.Schema$TextFormat {
  return forGoogle({
    foregroundColorStyle: textFormat.foregroundColorStyle
      ? toColorStyle(textFormat.foregroundColorStyle)
      : undefined,
    fontFamily: textFormat.fontFamily,
    fontSize: textFormat.fontSize,
    bold: textFormat.bold,
    italic: textFormat.italic,
    strikethrough: textFormat.strikethrough,
    underline: textFormat.underline,
  });
}

/** Carry a CellFormat across the Google boundary. */
export function toCellFormat(format: CellFormat): sheets_v4.Schema$CellFormat {
  return forGoogle({
    numberFormat: format.numberFormat ? forGoogle(format.numberFormat) : undefined,
    backgroundColorStyle: format.backgroundColorStyle
      ? toColorStyle(format.backgroundColorStyle)
      : undefined,
    textFormat: format.textFormat ? toTextFormat(format.textFormat) : undefined,
    horizontalAlignment: format.horizontalAlignment,
    verticalAlignment: format.verticalAlignment,
    wrapStrategy: format.wrapStrategy,
  });
}

/** Carry a Border across the Google boundary. */
export function toBorder(border: Border): sheets_v4.Schema$Border {
  return forGoogle({
    style: border.style,
    colorStyle: border.colorStyle ? toColorStyle(border.colorStyle) : undefined,
  });
}
