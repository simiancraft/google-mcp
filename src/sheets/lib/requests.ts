import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { ColorStyle } from '../entities/ColorStyle.js';

/**
 * Apply one batchUpdate request to a spreadsheet and return its reply.
 * `spreadsheets.batchUpdate` takes a union-typed requests array of 69 request
 * types; the suite exposes a curated subset as purpose-named operations, each
 * of which funnels through here with exactly one request. Request types whose
 * reply is empty (deletes, property updates) get `{}` back.
 */
export async function applyRequest(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  request: sheets_v4.Schema$Request,
): Promise<sheets_v4.Schema$Response> {
  const { data } = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [request] },
  });
  return data.replies?.[0] ?? {};
}

/**
 * Build an update request's field mask from the arguments actually provided:
 * one path per defined key, with each key named in `expand` broken into one
 * path per defined subkey, so an untouched sibling (a frozen count, a bold
 * flag) is not reset to its default by a too-wide mask. Returns the
 * comma-joined mask, empty when nothing was provided; callers must reject an
 * empty mask rather than send it (Google reads it as "update no fields").
 */
export function fieldPaths(
  provided: Record<string, unknown>,
  expand: readonly string[] = [],
): string {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(provided)) {
    if (value === undefined) continue;
    if (expand.includes(key) && value !== null && typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue !== undefined) paths.push(`${key}.${subKey}`);
      }
    } else {
      paths.push(key);
    }
  }
  return paths.join(',');
}

/**
 * Carry a ColorStyle across the Google boundary: `forGoogle` at each level, so
 * absent channels and the absent variant stay absent (see optionality.ts).
 */
export function toColorStyle(colorStyle: ColorStyle): sheets_v4.Schema$ColorStyle {
  return forGoogle({
    rgbColor: colorStyle.rgbColor ? forGoogle(colorStyle.rgbColor) : undefined,
    themeColor: colorStyle.themeColor,
  });
}
