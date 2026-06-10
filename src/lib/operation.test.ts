import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { type AnyOperation, mergeOperations, type Operation, operation } from './operation.js';

type FakeClient = { tag: 'fake' };

describe('operation', () => {
  it('returns its definition unchanged (identity at runtime)', () => {
    const def = {
      description: 'echo the input',
      schema: { input: z.object({ text: z.string() }), output: z.object({ text: z.string() }) },
      handler: async (_client: FakeClient, args: { text: string }) => args,
    };
    expect(operation(def)).toBe(def);
  });

  it('passes destructive through', () => {
    const danger = operation({
      description: 'permanent delete',
      schema: { input: z.object({ id: z.string() }), output: z.object({ id: z.string() }) },
      handler: async (_client: FakeClient, args) => args,
      destructive: true,
    });
    expect(danger.destructive).toBe(true);
  });

  it('infers Client from the handler and I/O from the schema', async () => {
    const op = operation({
      description: 'double a count',
      schema: { input: z.object({ n: z.number() }), output: z.object({ n: z.number() }) },
      handler: async (client: FakeClient, args) => ({
        n: args.n * (client.tag === 'fake' ? 2 : 1),
      }),
    });

    // The annotation is the assertion: if inference dropped Client or the I/O
    // types, this `satisfies` would fail to compile (tests are typechecked).
    const typed = op satisfies Operation<
      FakeClient,
      z.ZodObject<{ n: z.ZodNumber }>,
      z.ZodObject<{ n: z.ZodNumber }>
    >;
    expect(typed).toBe(op);

    // Erasure direction: a concrete Operation must stay assignable to the
    // schema-erased AnyOperation the registry holds. If a zod change made
    // `z.infer<z.ZodType>` something other than `unknown`, this would stop
    // compiling and fail CI rather than silently re-opening the `never` hole.
    const erased: AnyOperation<FakeClient> = op;
    expect(erased).toBe(op);

    expect(await op.handler({ tag: 'fake' }, { n: 21 })).toEqual({ n: 42 });
  });
});

describe('mergeOperations', () => {
  const make = (description: string) =>
    operation({
      description,
      schema: { input: z.object({}), output: z.object({}) },
      handler: async (_client: FakeClient) => ({}),
    });

  it('merges groups into one registry keyed by wire name', () => {
    const merged = mergeOperations({ a: make('a') }, { b: make('b') });
    expect(Object.keys(merged).sort()).toEqual(['a', 'b']);
  });

  it('throws on a duplicate wire name across groups', () => {
    expect(() => mergeOperations({ dup: make('first') }, { dup: make('second') })).toThrow(
      'Duplicate operation name: dup',
    );
  });
});
