import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { nonStrictObjectPaths } from './surface-pins.js';

describe('nonStrictObjectPaths', () => {
  it('names every loose object node, at any depth', () => {
    const loose = z.toJSONSchema(
      z.strictObject({ criteria: z.object({ nested: z.object({ a: z.string() }) }) }),
      { io: 'input' },
    );
    expect(nonStrictObjectPaths(loose, 'op')).toEqual([
      'op.properties.criteria',
      'op.properties.criteria.properties.nested',
    ]);
  });

  it('returns nothing for a strict tree', () => {
    const strict = z.toJSONSchema(z.strictObject({ criteria: z.strictObject({ a: z.string() }) }), {
      io: 'input',
    });
    expect(nonStrictObjectPaths(strict, 'op')).toEqual([]);
  });
});
