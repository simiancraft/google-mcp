import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
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
export type Operation<Client, In extends z.ZodObject, Out extends z.ZodObject> = {
  description: string;
  schema: { input: In; output: Out };
  handler: (client: Client, args: z.infer<In>) => Promise<z.infer<Out>>;
  /**
   * MCP tool annotations, emitted verbatim in `tools/list`: the four behavior
   * hints (readOnlyHint, destructiveHint, idempotentHint, openWorldHint),
   * declared explicitly per operation. Tools transcribe the Tool Annotations
   * section of their Google MCP reference page; methods are classified by the
   * same rubric (see EXTENDING.md).
   * @see https://modelcontextprotocol.io/specification/2025-06-18/schema (ToolAnnotations)
   */
  annotations?: ToolAnnotations;
  /** @deprecated migration shim: pre-annotations destructive flag; replaced by `annotations.destructiveHint`. */
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
  schema: { input: z.ZodObject; output: z.ZodObject };
  handler: (client: Client, args: never) => Promise<unknown>;
  annotations?: ToolAnnotations;
  /** @deprecated migration shim; see `Operation.destructive`. */
  destructive?: boolean;
};

/**
 * Define an operation. A no-op at runtime (it returns its argument); its job is
 * type inference (`Client` from the handler's first parameter, `input`/`output`
 * from `schema`) and the front-door check that the handler consumes exactly what
 * the schema declares.
 */
export const operation = <Client, In extends z.ZodObject, Out extends z.ZodObject>(
  def: Operation<Client, In, Out>,
): Operation<Client, In, Out> => def;

/**
 * Merge operation groups (e.g. a service's tools and methods) into the single
 * registry the server dispatches. Throws on a duplicate wire name: two operations
 * cannot answer to the same key, and a silent `{ ...a, ...b }` spread would let
 * one shadow the other and vanish from the wire with no error.
 */
export function mergeOperations<Client>(
  ...groups: Record<string, AnyOperation<Client>>[]
): Record<string, AnyOperation<Client>> {
  const merged: Record<string, AnyOperation<Client>> = {};
  for (const group of groups) {
    for (const [name, op] of Object.entries(group)) {
      if (Object.hasOwn(merged, name)) {
        throw new Error(`Duplicate operation name: ${name}`);
      }
      merged[name] = op;
    }
  }
  return merged;
}
