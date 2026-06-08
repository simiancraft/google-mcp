import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  CallToolRequestSchema,
  type CallToolResult,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import type { AnyOperation } from './operation.js';

export type ServerOptions<Client> = {
  /** MCP server name (the service, e.g. 'gmail'). */
  name: string;
  version?: string;
  /** Every operation this server exposes, keyed by wire name (tools and methods merged). */
  operations: Record<string, AnyOperation<Client>>;
  /** Build the authenticated client for the account this instance is bound to. */
  client: (account: string | undefined) => Promise<Client>;
  /** Optional consent flow, invoked by the `auth` subcommand. */
  runAuth?: (account: string | undefined) => Promise<void>;
  /** Transport to connect; defaults to stdio. Injectable for tests. */
  transport?: Transport;
};

function errorResult(message: string): CallToolResult {
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
}

/**
 * Build the MCP `tools/list` payload from the operations: each one's input and
 * output JSON Schema, plus a destructive hint for irreversible ops. On the wire,
 * every operation is a "tool" (MCP has no other word). Pure; exported for tests.
 */
export function toolDefinitions<Client>(operations: Record<string, AnyOperation<Client>>) {
  return Object.entries(operations).map(([name, op]) => ({
    name,
    description: op.description,
    inputSchema: z.toJSONSchema(op.schema.input, { io: 'input' }) as Record<string, unknown>,
    outputSchema: z.toJSONSchema(op.schema.output, { io: 'output' }) as Record<string, unknown>,
    ...(op.destructive ? { annotations: { destructiveHint: true } } : {}),
  }));
}

/**
 * Render the operations as a Markdown capability table (name, description, and an
 * irreversible marker), derived from the same registry the server dispatches. A
 * static mirror of the surface; agents that speak MCP discover the live,
 * fully-schema'd surface via `tools/list`. Pure; a service regenerates its
 * CAPABILITIES.md from this so the doc cannot drift from the code.
 */
export function renderCapabilities<Client>(
  title: string,
  operations: Record<string, AnyOperation<Client>>,
): string {
  const rows = Object.entries(operations).map(
    ([name, op]) => `| \`${name}\`${op.destructive ? ' ⚠️' : ''} | ${op.description} |`,
  );
  return `${[
    `# ${title}`,
    '',
    `${rows.length} operations. ⚠️ marks irreversible operations (MCP \`destructiveHint\`).`,
    '',
    '| Operation | Description |',
    '| --- | --- |',
    ...rows,
  ].join('\n')}\n`;
}

/**
 * Run one operation by name: resolve it, validate input against its schema, run
 * the handler, validate the output, and return both a structured result and a text
 * rendering (for clients that do not yet read `structuredContent`). All failure
 * paths return an `isError` result rather than throwing. Exported for tests.
 */
export async function callOperation<Client>(
  operations: Record<string, AnyOperation<Client>>,
  client: Client,
  name: string,
  rawArgs: unknown,
): Promise<CallToolResult> {
  const op = operations[name];
  if (!op) {
    return errorResult(`Unknown tool: ${name}`);
  }

  const parsed = op.schema.input.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return errorResult(`Invalid arguments for ${name}: ${parsed.error.message}`);
  }

  try {
    const result = await op.handler(client, parsed.data as never);
    const validated = op.schema.output.parse(result);
    return {
      content: [{ type: 'text', text: JSON.stringify(validated, null, 2) }],
      structuredContent: validated as Record<string, unknown>,
    };
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Turn a service's operations into a running stdio MCP server. Identical for every
 * service; only the bound `Client` type and the operations differ. Owns the
 * cross-cutting concerns: the `auth` subcommand, account binding, the `tools/list`
 * payload, dispatch, validation, and error wrapping.
 */
export async function server<Client>(options: ServerOptions<Client>): Promise<void> {
  const { name, version = '0.0.0', operations, client, runAuth } = options;

  if (process.argv[2] === 'auth') {
    if (!runAuth) {
      console.error(`${name}: no auth flow configured.`);
      process.exit(1);
    }
    await runAuth(process.argv[3] ?? process.env.GOOGLE_MCP_ACCOUNT);
    process.exit(0);
  }

  const authed = await client(process.env.GOOGLE_MCP_ACCOUNT);
  const mcp = new Server({ name, version }, { capabilities: { tools: {} } });

  mcp.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions(operations),
  }));

  mcp.setRequestHandler(CallToolRequestSchema, (request) =>
    callOperation(operations, authed, request.params.name, request.params.arguments),
  );

  await mcp.connect(options.transport ?? new StdioServerTransport());
}
