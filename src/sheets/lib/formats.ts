import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import { narrow } from '../../lib/utils/narrow.js';
import type { Border } from '../entities/Border.js';
import type { CellFormat } from '../entities/CellFormat.js';
import { ColorStyle } from '../entities/ColorStyle.js';
import type { TextFormat } from '../entities/TextFormat.js';

/**
 * Format-noun carriers: the request-direction mirror of spreadsheet.ts's
 * projections, taking documented entities across the Google boundary with
 * `forGoogle` at each level (see optionality.ts). Each carrier enumerates its
 * entity's fields by hand, so a field added to an entity without a carrier
 * line compiles unchanged and silently drops at the boundary; the handler
 * tests' exact-params assertions are the guard, so extend them with the field.
 */

/**
 * Carry a ColorStyle across the Google boundary. Enforces the entity's
 * documented exactly-one rule here, once, for every input path (tab colors,
 * fills, text foregrounds, borders): the REST field is a oneof, and Google
 * rejects both-set with "oneof field 'kind' is already set" (live-verified).
 * The rule stays out of the entity itself because the output projection
 * deliberately degrades an unknown theme color to an empty ColorStyle.
 */
export function toColorStyle(colorStyle: ColorStyle): sheets_v4.Schema$ColorStyle {
  if ((colorStyle.rgbColor === undefined) === (colorStyle.themeColor === undefined)) {
    throw new Error('Provide exactly one of rgbColor or themeColor in a color.');
  }
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
    link: textFormat.link ? { uri: textFormat.link.uri } : undefined,
  });
}

/** Project a REST text format, cleaning nulls and narrowing its color style. */
export function projectTextFormat(data: sheets_v4.Schema$TextFormat): TextFormat {
  return {
    foregroundColorStyle: data.foregroundColorStyle
      ? projectColorStyle(data.foregroundColorStyle)
      : data.foregroundColor
        ? projectColorStyle({ rgbColor: data.foregroundColor })
        : undefined,
    fontFamily: data.fontFamily ?? undefined,
    fontSize: data.fontSize ?? undefined,
    bold: data.bold ?? undefined,
    italic: data.italic ?? undefined,
    strikethrough: data.strikethrough ?? undefined,
    underline: data.underline ?? undefined,
    link: data.link?.uri ? { uri: data.link.uri } : undefined,
  };
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

/** Project a REST color style onto the ColorStyle shape, dropping unknown theme colors. */
export function projectColorStyle(data: sheets_v4.Schema$ColorStyle): ColorStyle {
  return {
    rgbColor: data.rgbColor
      ? {
          red: data.rgbColor.red ?? undefined,
          green: data.rgbColor.green ?? undefined,
          blue: data.rgbColor.blue ?? undefined,
        }
      : undefined,
    themeColor: narrow(data.themeColor, ColorStyle.shape.themeColor.unwrap().options),
  };
}
