import { z } from 'zod';
import { BooleanCondition } from './BooleanCondition.js';
import { ColorStyle } from './ColorStyle.js';

/**
 * Criteria for showing or hiding rows in a filter or filter view.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#FilterCriteria
 */
export const FilterCriteria = z.strictObject({
  hiddenValues: z.array(z.string()).optional().describe('Values that should be hidden.'),
  condition: BooleanCondition.optional().describe(
    'A condition that must be true for values to be shown. Hidden values remain hidden even when they satisfy the condition.',
  ),
  visibleBackgroundColorStyle: ColorStyle.optional().describe(
    'An RGB fill color to show; only cells with this background color are shown. Provide this or visibleForegroundColorStyle, not both.',
  ),
  visibleForegroundColorStyle: ColorStyle.optional().describe(
    'An RGB text color to show; only cells with this foreground color are shown. Provide this or visibleBackgroundColorStyle, not both.',
  ),
});

export type FilterCriteria = z.infer<typeof FilterCriteria>;
