import { z } from 'zod';

// Header-bound inputs (addresses, subject, message ids) must not carry control
// characters or line breaks: a CRLF in an address string injects a new header
// line (e.g. a silent `Bcc:`) when the message is assembled. Inputs are rejected
// at the schema, and stripped defensively where headers are built.

/** C0 control characters (incl. CR/LF) and DEL — never valid in a header value. */
function isControl(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code < 0x20 || code === 0x7f;
}

/** A string safe to place in an RFC 822 header: no control characters or line breaks. */
export const headerSafe = z
  .string()
  .refine(
    (value) => ![...value].some(isControl),
    'must not contain control characters or line breaks',
  );

/** Strip control characters and line breaks, defending header assembly from injection. */
export function stripBreaks(value: string): string {
  return [...value].filter((ch) => !isControl(ch)).join('');
}
