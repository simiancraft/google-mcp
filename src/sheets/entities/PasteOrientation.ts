import { z } from 'zod';

/**
 * How copied data should be oriented at its destination.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#PasteOrientation
 */
export const PasteOrientation = z.enum(['NORMAL', 'TRANSPOSE']);

export type PasteOrientation = z.infer<typeof PasteOrientation>;
