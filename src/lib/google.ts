/**
 * The single boundary between our `exactOptionalPropertyTypes`-strict code and
 * Google's API types.
 *
 * Google's generated types model an optional field as `field?: T` (the value
 * never includes `undefined`). Our code models optionality explicitly as
 * `field?: Optional<T>` (`T | undefined`). Under `exactOptionalPropertyTypes`
 * those are incompatible: an object literal that carries `field: T | undefined`
 * cannot be passed where `field?: T` is expected.
 *
 * `forGoogle` is the one place that reconciles the two. It drops every
 * `undefined`-valued key, and its return type proves they are gone, so the
 * mismatch is resolved here and nowhere else, with no suppression. Everywhere
 * else in the codebase stays fully strict.
 *
 * There is no behavioral change: `JSON.stringify` omits `undefined` keys and
 * gaxios drops `undefined` query params, so what reaches Google is identical
 * whether a key is absent or present-and-undefined. This adapter only makes the
 * types say what already happens at runtime.
 */
export type ForGoogle<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
};

export function forGoogle<T extends object>(params: T): ForGoogle<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as ForGoogle<T>;
}
