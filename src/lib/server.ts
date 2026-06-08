import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  CallToolRequestSchema,
  type CallToolResult,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import pkg from '../../package.json' with { type: 'json' };
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

/** A labeled set of operations for the capability table: its provenance + the ops. */
export type CapabilityGroup<Client> = {
  /** Provenance shown in the Source column, e.g. 'MCP Tool' or 'REST Method'. */
  kind: string;
  operations: Record<string, AnyOperation<Client>>;
};

/**
 * Render the operations as a Markdown capability table (name, source, description,
 * and an irreversible marker), derived from the same registries the server
 * dispatches. The Source column makes the dual surface explicit: the suite is both
 * an MCP-toolset wrapper and a REST wrapper, because MCP's toolset alone cannot
 * fully drive a service. A static mirror; agents that speak MCP discover the live,
 * fully-schema'd surface via `tools/list`. Pure; a service regenerates its
 * CAPABILITIES.md from this so the doc cannot drift from the code.
 */
export function renderCapabilities<Client>(
  title: string,
  groups: CapabilityGroup<Client>[],
): string {
  const rows = groups.flatMap(({ kind, operations }) =>
    Object.entries(operations).map(
      ([name, op]) => `| \`${name}\`${op.destructive ? ' ⚠️' : ''} | ${kind} | ${op.description} |`,
    ),
  );
  return `${[
    `# ${title}`,
    '',
    `${rows.length} operations across MCP tools and REST methods. ⚠️ marks irreversible operations (MCP \`destructiveHint\`).`,
    '',
    '| Operation | Source | Description |',
    '| --- | --- | --- |',
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
    // `parsed.data` was just validated against this op's input schema, so it is
    // the handler's real input shape. The `AnyOperation` boundary types the
    // handler's args as `never` (so any concrete Operation stays assignable; see
    // operation.ts), and `as never` is the only call form. The validation above
    // is what makes this safe: do not call the handler before parsing.
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
  const { name, version = pkg.version, operations, client, runAuth } = options;

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
