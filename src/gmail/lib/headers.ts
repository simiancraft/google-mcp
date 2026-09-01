import { z } from 'zod';

// Header-bound inputs (addresses, subject, message ids) must not carry control
// characters or line breaks: a CRLF in an address string injects a new header
// line (e.g. a silent `Bcc:`) when the message is assembled. Inputs are rejected
// at the schema, and stripped defensively where headers are built.

/** True for C0 control characters (incl. CR/LF) and DEL, which are never valid in a header. */
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

/**
 * Make a value safe for a quoted MIME header parameter (`name="..."`,
 * `filename="..."`): strip control characters (header injection) plus double
 * quotes and backslashes, which the MIME builder interpolates unescaped into
 * the quoted string.
 */
export function headerParamSafe(value: string): string {
  return stripBreaks(value).replaceAll('"', '').replaceAll('\\', '');
}
