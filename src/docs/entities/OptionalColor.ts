import { z } from 'zod';
import { Color } from './Color.js';

/**
 * A color that can also be fully transparent: with `color` set it is that
 * opaque color, and with `color` omitted it is transparent. Transcribed with
 * Google's nesting (`{ color: { rgbColor: { red, green, blue } } }`) so the
 * vocabulary matches the REST reference.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#OptionalColor
 */
export const OptionalColor = z.strictObject({
  color: Color.optional().describe(
    'If set, this will be used as an opaque color. If unset, this represents a transparent color.',
  ),
});

export type OptionalColor = z.infer<typeof OptionalColor>;
