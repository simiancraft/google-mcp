import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Range } from '../../entities/Range.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe('The range to apply the bullet preset to.'),
    bulletPreset: z
      .enum([
        'BULLET_DISC_CIRCLE_SQUARE',
        'BULLET_DIAMONDX_ARROW3D_SQUARE',
        'BULLET_CHECKBOX',
        'BULLET_ARROW_DIAMOND_DISC',
        'BULLET_STAR_CIRCLE_SQUARE',
        'BULLET_ARROW3D_CIRCLE_SQUARE',
        'BULLET_LEFTTRIANGLE_DIAMOND_DISC',
        'BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE',
        'BULLET_DIAMOND_CIRCLE_SQUARE',
        'NUMBERED_DECIMAL_ALPHA_ROMAN',
        'NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS',
        'NUMBERED_DECIMAL_NESTED',
        'NUMBERED_UPPERALPHA_ALPHA_ROMAN',
        'NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL',
        'NUMBERED_ZERODECIMAL_ALPHA_ROMAN',
      ])
      .describe(
        'The kinds of bullet glyphs to use, named by the glyphs of the first three nesting levels: BULLET_* presets are unordered lists, NUMBERED_* presets ordered lists.',
      ),
  }),
  output: BatchUpdateReceipt,
};
