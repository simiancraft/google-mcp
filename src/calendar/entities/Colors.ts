import { z } from 'zod';

/**
 * One palette entry: a background color and the foreground color legible on
 * top of it.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/colors/get
 */
export const ColorDefinition = z.object({
  background: z
    .string()
    .describe('The background color associated with this color definition, as hex.'),
  foreground: z
    .string()
    .describe('The foreground color that can be used to write on top of the background color.'),
});

export type ColorDefinition = z.infer<typeof ColorDefinition>;

/**
 * The global color palettes: calendar colors (referenced by a calendar list
 * entry's colorId) and event colors (referenced by an event's colorId).
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/colors/get
 */
export const Colors = z.object({
  updated: z
    .string()
    .optional()
    .describe('Last modification time of the color palettes (as an RFC3339 timestamp).'),
  calendar: z
    .record(z.string(), ColorDefinition)
    .describe('The calendar color palette, mapping a color ID to its definition.'),
  event: z
    .record(z.string(), ColorDefinition)
    .describe('The event color palette, mapping a color ID (1 through 11) to its definition.'),
});

export type Colors = z.infer<typeof Colors>;
