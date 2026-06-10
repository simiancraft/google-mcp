/**
 * An explicitly optional value: `T` or `undefined`.
 *
 * Pair with `?` on a property (`field?: Optional<T>`) so the key may be absent
 * and, under `exactOptionalPropertyTypes`, may also be an explicit `undefined`.
 * We keep optionality explicit in our own types rather than implicit in a bare
 * `?`; the word mirrors Google's field language (its docs mark fields "Optional.").
 *
 * This is a value-type alias, not a property modifier: it complements `?`, it
 * does not replace it.
 */
export type Optional<T> = T | undefined;
