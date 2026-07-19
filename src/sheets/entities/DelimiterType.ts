import { z } from 'zod';

/**
 * The delimiter on which text is split into columns.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DelimiterType
 */
export const DelimiterType = z.enum([
  'COMMA',
  'SEMICOLON',
  'PERIOD',
  'SPACE',
  'CUSTOM',
  'AUTODETECT',
]);

export type DelimiterType = z.infer<typeof DelimiterType>;
