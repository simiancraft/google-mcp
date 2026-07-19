import { z } from 'zod';
import { Editors } from './Editors.js';
import { GridRange } from './GridRange.js';

/**
 * A protected range or protected sheet: a region only the granted editors
 * (listed users and groups, or the whole domain with domainUsersCanEdit) can
 * change, or (when warning-only) a region anyone can change after confirming
 * a warning. Backed by either a grid range (fully unbounded means the whole
 * sheet is protected) or a named range.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#ProtectedRange
 */
export const ProtectedRange = z.object({
  protectedRangeId: z.number().int().optional().describe('The ID of the protected range.'),
  range: GridRange.optional().describe(
    'The range that is being protected; fully unbounded means the whole sheet is protected.',
  ),
  namedRangeId: z
    .string()
    .optional()
    .describe('The named range this protected range is backed by, if any.'),
  description: z.string().optional().describe('The description of this protected range.'),
  warningOnly: z
    .boolean()
    .optional()
    .describe(
      'True if this protected range shows a warning when editing instead of restricting who can edit.',
    ),
  requestingUserCanEdit: z
    .boolean()
    .optional()
    .describe('True if the user who requested this protected range can edit the protected area.'),
  unprotectedRanges: z
    .array(GridRange)
    .optional()
    .describe(
      'The list of unprotected ranges within a protected sheet; only supported on protected sheets.',
    ),
  editors: Editors.optional().describe(
    'The users and groups with edit access to the protected range.',
  ),
});

export type ProtectedRange = z.infer<typeof ProtectedRange>;
