import { z } from 'zod';

/** Source: object (LabelColor) on the Gmail MCP reference. The color of a label. */
export const LabelColor = z.object({
  /** The text color of the label, as a hex string. */
  textColor: z.string(),
  /** The background color of the label, as a hex string. */
  backgroundColor: z.string(),
});

export type LabelColor = z.infer<typeof LabelColor>;
