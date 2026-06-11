/**
 * The message of an unknown throw: `Error`s render their message, anything
 * else stringifies. One spelling for every error surface (the tool envelope,
 * the doctor's CLI lines), so a non-Error throw degrades the same way
 * everywhere.
 */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
