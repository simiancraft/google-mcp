import type { docs_v1 } from '@googleapis/docs';

/**
 * Build the PT Dimension for a plain number of points, passing undefined
 * through: the fontSize precedent (PT is the API's only unit), shared by
 * every styling handler whose entity carries point-valued fields. Keeping
 * the conversion out of the entities keeps mask derivation on the entity
 * keys and the wire nesting in one place.
 */
export function pt(points: number): docs_v1.Schema$Dimension;
export function pt(points: undefined): undefined;
export function pt(points: number | undefined): docs_v1.Schema$Dimension | undefined;
export function pt(points: number | undefined): docs_v1.Schema$Dimension | undefined {
  return points === undefined ? undefined : { magnitude: points, unit: 'PT' };
}
