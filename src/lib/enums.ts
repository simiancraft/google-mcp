/**
 * Narrow a REST string onto an entity enum: the projection-side policy for
 * Google's output enums (EXTENDING.md, "Enum policy"). Unknown and `*_UNSPECIFIED` values drop
 * to `undefined` (the field goes absent) rather than passing through untyped
 * or being coerced to a wrong-but-valid value.
 */
export function narrow<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | undefined {
  return value != null && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}
