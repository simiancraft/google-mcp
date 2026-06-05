import type { z } from 'zod';

/**
 * A single MCP tool: its documented I/O contract plus the work that fulfills it.
 *
 * `input` and `output` are zod schemas (the contract, mirrored from the docs);
 * `handler` receives the service's authenticated client and the validated
 * input, and returns a value that conforms to `output`.
 */
export type Tool<Client, Input extends z.ZodType, Output extends z.ZodType> = {
  description: string;
  input: Input;
  output: Output;
  handler: (client: Client, args: z.infer<Input>) => Promise<z.infer<Output>>;
  /** Irreversible operation (send, permanent delete); surfaced as MCP destructiveHint. */
  destructive?: boolean;
};

/** A tool with its schemas erased; the shape the registry and server work with. */
export type AnyTool<Client> = Tool<Client, z.ZodType, z.ZodType>;

/**
 * Bind the tool factory to one service's client type. Every service calls this
 * once (`const defineTool = makeDefineTool<gmail_v1.Gmail>()`), then defines
 * each tool with it; `args` and the return type are inferred from the schemas,
 * so tool files never restate the client type.
 */
export function makeDefineTool<Client>() {
  return <Input extends z.ZodType, Output extends z.ZodType>(
    tool: Tool<Client, Input, Output>,
  ): Tool<Client, Input, Output> => tool;
}
