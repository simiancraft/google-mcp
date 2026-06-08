import { z } from 'zod';

/** Source: object (LabelColor) on the Gmail MCP reference. The color of a label. */
export const LabelColor = z.object({
  textColor: z.string().describe('The text color of the label, as a hex string.'),
  backgroundColor: z.string().describe('The background color of the label, as a hex string.'),
});

export type LabelColor = z.infer<typeof LabelColor>;
