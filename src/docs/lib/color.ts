import type { docs_v1 } from '@googleapis/docs';
import { forGoogle } from '../../lib/optionality.js';
import type { OptionalColor } from '../entities/OptionalColor.js';

/**
 * Cross the Google boundary for an OptionalColor, passing undefined through.
 * `forGoogle` is shallow and the color chain nests three levels
 * (`color.rgbColor.{red,green,blue}`), each with optional keys that
 * `exactOptionalPropertyTypes` will not let cross as present-and-undefined,
 * so the reconciliation happens once here for every color-bearing handler.
 */
export function optionalColor(value: OptionalColor): docs_v1.Schema$OptionalColor;
export function optionalColor(value: undefined): undefined;
export function optionalColor(
  value: OptionalColor | undefined,
): docs_v1.Schema$OptionalColor | undefined;
export function optionalColor(
  value: OptionalColor | undefined,
): docs_v1.Schema$OptionalColor | undefined {
  return value === undefined
    ? undefined
    : forGoogle({
        color:
          value.color === undefined ? undefined : { rgbColor: forGoogle(value.color.rgbColor) },
      });
}
