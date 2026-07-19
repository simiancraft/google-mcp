import { z } from 'zod';
import { DimensionGroup } from '../../entities/DimensionGroup.js';
import { DimensionRange } from '../../entities/DimensionRange.js';

const DimensionGroupUpdate = DimensionGroup.extend({
  range: DimensionRange.required({
    sheetId: true,
    dimension: true,
    startIndex: true,
    endIndex: true,
  }),
}).required({ collapsed: true });

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    dimensionGroup: DimensionGroupUpdate.describe(
      'The group to update. range and depth identify an existing group; collapsed is the new state.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    dimensionGroup: DimensionGroup.describe(
      'The group selector and collapsed state that were sent.',
    ),
    updatedFields: z.string().describe('The field mask applied to the dimension group.'),
  }),
};
