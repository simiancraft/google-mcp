import { z } from 'zod';
import { InterpolationPoint } from './InterpolationPoint.js';

/**
 * A gradient conditional format: cell backgrounds vary continuously between
 * the interpolation points' colors according to the cell values, a native
 * heat map that recalculates as values change.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#GradientRule
 */
export const GradientRule = z.strictObject({
  minpoint: InterpolationPoint.describe('The starting interpolation point.'),
  midpoint: InterpolationPoint.optional().describe('An optional midway interpolation point.'),
  maxpoint: InterpolationPoint.describe('The final interpolation point.'),
});

export type GradientRule = z.infer<typeof GradientRule>;
