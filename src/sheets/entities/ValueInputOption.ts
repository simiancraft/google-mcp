import { z } from 'zod';

/**
 * How written values are interpreted. Required on every write; REST rejects
 * writes without it. Shared by every values write operation so the contract
 * (and its caution) lives once.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/ValueInputOption
 */
export const ValueInputOption = z
  .enum(['RAW', 'USER_ENTERED'])
  .describe(
    'How the input data should be interpreted: RAW stores values as-is; USER_ENTERED parses them as if typed into the UI (numbers, dates, formulas). Required. Caution: with USER_ENTERED, a leading = becomes a live formula; writing untrusted content this way is a formula-injection risk (e.g. IMPORTRANGE or IMPORTDATA can exfiltrate sheet data when the spreadsheet is next opened).',
  );

export type ValueInputOption = z.infer<typeof ValueInputOption>;
