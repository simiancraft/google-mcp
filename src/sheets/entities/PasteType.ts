import { z } from 'zod';

/**
 * What kind of source data should be pasted.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#PasteType
 */
export const PasteType = z.enum([
  'PASTE_NORMAL',
  'PASTE_VALUES',
  'PASTE_FORMAT',
  'PASTE_NO_BORDERS',
  'PASTE_FORMULA',
  'PASTE_DATA_VALIDATION',
  'PASTE_CONDITIONAL_FORMATTING',
]);

export type PasteType = z.infer<typeof PasteType>;
