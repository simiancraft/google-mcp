import { z } from 'zod';

/** A 6-digit hex color (e.g. `#fb4c2f`), the form Gmail uses for label colors. */
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a 6-digit hex color, e.g. #fb4c2f');

/** Source: object (LabelColor) on the Gmail MCP reference. The color of a label. */
export const LabelColor = z.object({
  textColor: hexColor.describe('The text color of the label, as a hex string.'),
  backgroundColor: hexColor.describe('The background color of the label, as a hex string.'),
});

export type LabelColor = z.infer<typeof LabelColor>;
