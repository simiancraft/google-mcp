import { z } from 'zod';
import { Editors } from '../../entities/Editors.js';
import { GridRange } from '../../entities/GridRange.js';
import { ProtectedRange } from '../../entities/ProtectedRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to protect a range in.'),
    range: GridRange.optional().describe(
      'The range to protect; fully unbounded (just a sheetId) protects the whole sheet. Provide exactly one of range or namedRangeId.',
    ),
    namedRangeId: z
      .string()
      .optional()
      .describe(
        'The named range to back the protection with. Provide exactly one of range or namedRangeId.',
      ),
    description: z.string().optional().describe('The description of this protected range.'),
    warningOnly: z
      .boolean()
      .optional()
      .describe(
        'True for warning-based protection: every user can edit, but editing prompts a warning first. When true, editors are ignored.',
      ),
    unprotectedRanges: z
      .array(GridRange)
      .optional()
      .describe(
        'Ranges to leave editable within a protected sheet; only supported when protecting a whole sheet.',
      ),
    editors: Editors.optional().describe(
      'The users and groups with edit access to the protected range; not supported with warningOnly.',
    ),
  }),
  output: ProtectedRange,
};
