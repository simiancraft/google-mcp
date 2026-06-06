import { z } from 'zod';

/**
 * An email address with an optional display name, parsed from an address header
 * (From, To, Cc, Bcc).
 *
 * A projection-extension shape: Google's MCP projection returns addresses as
 * plain strings. This surfaces the display name and the bare address separately,
 * so callers can act on the person's name rather than infer it from the address.
 */
export const EmailAddress = z.object({
  /** The display name, when the header carried one (e.g. "Jane Roe"). */
  name: z.string().optional(),
  /** The bare email address (e.g. jane@example.com). */
  address: z.string(),
});

export type EmailAddress = z.infer<typeof EmailAddress>;
