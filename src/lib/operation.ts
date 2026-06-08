import type { z } from 'zod';

/**
 * A single operation: its documented I/O contract plus the work that fulfills it.
 * Every tool and method is an `Operation`; they differ only by which Google
 * reference the folder mirrors (MCP toolset vs REST), never by type.
 *
 * `schema` is the contract (zod, mirrored from the docs); `handler` receives the
 * service's authenticated client and the validated input and returns a value that
 * conforms to `schema.output`.
 */
export type Operation<Client, In extends z.ZodType, Out extends z.ZodType> = {
  description: string;
  schema: { input: In; output: Out };
  handler: (client: Client, args: z.infer<In>) => Promise<z.infer<Out>>;
  /** Irreversible (send, permanent delete) or a standing side effect (a forwarding filter); surfaced as MCP `destructiveHint`. */
  destructive?: boolean;
};

/**
 * An operation with its schemas erased; the shape the registry and server hold.
 * The handler's args are widened to `never` so any concrete `Operation` is
 * assignable here (a handler taking a specific input is assignable to one taking
 * `never` by contravariance; under zod 4, `z.infer<z.ZodType>` is `unknown`, which
 * would break that, so `never` restores it).
 */
export type AnyOperation<Client> = {
  description: string;
  schema: { input: z.ZodType; output: z.ZodType };
  handler: (client: Client, args: never) => Promise<unknown>;
  destructive?: boolean;
};

/**
 * Define an operation. A no-op at runtime (it returns its argument); its job is
 * type inference — `Client` from the handler's first parameter, `input`/`output`
 * from `schema` — and the front-door check that the handler consumes exactly what
 * the schema declares.
 */
export const operation = <Client, In extends z.ZodType, Out extends z.ZodType>(
  def: Operation<Client, In, Out>,
): Operation<Client, In, Out> => def;
