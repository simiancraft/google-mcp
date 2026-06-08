import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { type Operation, operation } from './operation.js';

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
    const _typed = op satisfies Operation<
      FakeClient,
      z.ZodObject<{ n: z.ZodNumber }>,
      z.ZodObject<{ n: z.ZodNumber }>
    >;

    expect(await op.handler({ tag: 'fake' }, { n: 21 })).toEqual({ n: 42 });
  });
});
