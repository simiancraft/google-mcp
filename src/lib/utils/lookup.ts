/**
 * Own-property map lookup: an inherited key (`__proto__`, `toString`,
 * `constructor`) misses instead of resolving through the prototype. The
 * suite's one primitive for reading plain-object maps with caller-influenced
 * keys; the convention recurred at five sites (and was forgotten twice in
 * review) before becoming this function, so reach for it rather than
 * remembering the guard.
 */
export function ownLookup<T>(map: Record<string, T>, key: string): T | undefined {
  return Object.hasOwn(map, key) ? map[key] : undefined;
}
