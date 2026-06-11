import type { z } from 'zod';

/**
 * The four MCP tool-behavior hints, all required: every operation declares its
 * full annotation quad explicitly, the same way Google's MCP reference pages
 * present them (each page ends with a Tool Annotations section listing all
 * four). Structurally a strict subset of the SDK's `ToolAnnotations`, whose
 * fields are all optional with dangerous defaults (an absent `destructiveHint`
 * means true on the wire); requiring all four here keeps an unclassified
 * operation from compiling and keeps the emitted payload free of default
 * ambiguity. Do not abstract the quads into named profiles or category
 * constants; the explicit flags are the transcription.
 *
 * Design provenance:
 * - Field semantics: the MCP specification's `ToolAnnotations`,
 *   https://modelcontextprotocol.io/specification/2025-06-18/schema
 * - Classification: tools transcribe their Google MCP reference page's
 *   Tool Annotations section verbatim; methods follow the rubric those pages
 *   establish (EXTENDING.md, "Annotations")
 * - Per the spec, annotations are hints, not guarantees; clients treat them
 *   as untrusted
 */
export type OperationAnnotations = {
  /** True when the operation does not modify its environment (a pure read). */
  readOnlyHint: boolean;
  /**
   * True when the operation may perform non-additive updates: removals
   * (delete, clear, trash, unlabel, unsubscribe), sends, and standing side
   * effects. Updates and additive modifications are false, per Google's own
   * `update_event` classification.
   */
  destructiveHint: boolean;
  /**
   * True when repeating the call with the same arguments has no additional
   * effect (reads, updates, removals); false for creates and sends, which
   * duplicate their effect.
   */
  idempotentHint: boolean;
  /**
   * True when the operation reaches arbitrary external entities (Gmail's
   * sends); false for everything bound to the account's own data.
   */
  openWorldHint: boolean;
};

/**
 * The `_meta` key under which an operation's source citation crosses the wire,
 * prefixed per the MCP spec's convention for custom metadata (reverse-DNS,
 * matching the SDK's own `io.modelcontextprotocol/related-task`).
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic#meta
 */
export const SOURCE_META_KEY = 'com.simiancraft.google-mcp/source';

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
  /** The four MCP behavior hints, emitted verbatim in `tools/list`; see {@link OperationAnnotations}. */
  annotations: OperationAnnotations;
  /**
   * The Google reference page this operation transcribes: the MCP toolset page
   * for tools, the REST method page for methods. Emitted in `tools/list` as
   * `_meta[SOURCE_META_KEY]`, so an agent can fetch the authoritative
   * documentation for any operation it is about to call; the generated
   * CAPABILITIES.md links each operation to it.
   */
  source: string;
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
  annotations: OperationAnnotations;
  source: string;
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
