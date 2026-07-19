import { z } from 'zod';
import { Editors } from '../../entities/Editors.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the protected range.'),
    protectedRangeId: z.number().int().describe('The ID of the protected range to update.'),
    range: GridRange.optional().describe(
      'The new range to protect; fully unbounded (just a sheetId) protects the whole sheet.',
    ),
    namedRangeId: z
      .string()
      .optional()
      .describe('The new named range to back the protection with.'),
    description: z.string().optional().describe('The new description of this protected range.'),
    warningOnly: z
      .boolean()
      .optional()
      .describe(
        'True for warning-based protection: every user can edit, but editing prompts a warning first. Changing this from true to false without also providing editors resets the editors to all the editors in the document.',
      ),
    unprotectedRanges: z
      .array(GridRange)
      .optional()
      .describe(
        'The new list of ranges to leave editable within a protected sheet; only supported when protecting a whole sheet.',
      ),
    editors: Editors.optional().describe(
      'The new users and groups with edit access to the protected range; not supported with warningOnly.',
    ),
  }),
  /** The update reply is empty; we confirm the ids and the mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    protectedRangeId: z.number().describe('The ID of the updated protected range.'),
    updatedFields: z
      .string()
      .describe('The field mask that was applied, one path per field provided.'),
  }),
};
