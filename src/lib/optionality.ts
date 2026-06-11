/**
 * The optionality policy, in one place: how this suite spells "may be absent"
 * and how that spelling crosses the Google boundary.
 *
 * Our own types model optionality explicitly as `field?: Optional<T>`
 * (`T | undefined`): the key may be absent and, under
 * `exactOptionalPropertyTypes`, may also be an explicit `undefined`. The word
 * mirrors Google's field language (its docs mark fields "Optional.").
 *
 * Google's generated types model the same idea as a bare `field?: T` (the
 * value never includes `undefined`), and under `exactOptionalPropertyTypes`
 * the two spellings are incompatible: an object literal carrying
 * `field: T | undefined` cannot be passed where `field?: T` is expected.
 * `forGoogle` is the one place that reconciles them. It drops every
 * `undefined`-valued key, and its return type proves they are gone, so the
 * mismatch is resolved here and nowhere else, with no suppression.
 *
 * There is no behavioral change at the boundary: `JSON.stringify` omits
 * `undefined` keys and gaxios drops `undefined` query params, so what reaches
 * Google is identical whether a key is absent or present-and-undefined. The
 * adapter only makes the types say what already happens at runtime.
 */

/**
 * An explicitly optional value: `T` or `undefined`. A value-type alias, not a
 * property modifier: it complements `?`, it does not replace it.
 */
export type Optional<T> = T | undefined;

export type ForGoogle<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
};

export function forGoogle<T extends object>(params: T): ForGoogle<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as ForGoogle<T>;
}
