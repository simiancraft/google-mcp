import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';

/**
 * Alternating color properties for one dimension of a banded range. Header
 * and footer colors take priority over band colors, first-band colors take
 * priority over second-band colors, then row properties take priority over
 * column properties. A column header or first band can therefore override a
 * lower-priority row band.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BandingProperties
 */
export const BandingProperties = z.strictObject({
  headerColorStyle: ColorStyle.optional().describe(
    'The color of the first row or column; when present, alternating band colors start on the second row or column.',
  ),
  firstBandColorStyle: ColorStyle.optional().describe('The first alternating color.'),
  secondBandColorStyle: ColorStyle.optional().describe('The second alternating color.'),
  footerColorStyle: ColorStyle.optional().describe(
    'The color of the last row or column; when absent, the alternating colors continue through the last row or column.',
  ),
});

export type BandingProperties = z.infer<typeof BandingProperties>;
