import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  type CallToolResult,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { AnyTool } from './defineTool.js';

export type CreateServerOptions<Client> = {
  /** MCP server name (the service, e.g. 'gmail'). */
  name: string;
  version?: string;
  /** OAuth scopes this service needs; surfaced for the auth flow. */
  scopes: string[];
  /** The tool registry; keys are the wire tool names. */
  tools: Record<string, AnyTool<Client>>;
  /** Build the authenticated client for the account this instance is bound to. */
  client: (account: string | undefined) => Promise<Client>;
  /** Optional consent flow, invoked by the `auth` subcommand. */
  runAuth?: (account: string | undefined) => Promise<void>;
};

function errorResult(message: string): CallToolResult {
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
}

/**
 * Run one tool by name: resolve it, validate input against its schema, run the
 * handler, validate the output, and return both a structured result and a text
 * rendering (for clients that do not yet read `structuredContent`). All failure
 * paths return an `isError` result rather than throwing. Exported for tests.
 */
export async function callTool<Client>(
  tools: Record<string, AnyTool<Client>>,
  client: Client,
  name: string,
  rawArgs: unknown,
): Promise<CallToolResult> {
  const tool = tools[name];
  if (!tool) {
    return errorResult(`Unknown tool: ${name}`);
  }

  const parsed = tool.input.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return errorResult(`Invalid arguments for ${name}: ${parsed.error.message}`);
  }

  try {
    const result = await tool.handler(client, parsed.data);
    const validated = tool.output.parse(result);
    return {
      content: [{ type: 'text', text: JSON.stringify(validated, null, 2) }],
      structuredContent: validated as Record<string, unknown>,
    };
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Turn a tool registry into a running stdio MCP server. This is identical for
 * every service; only the bound `Client` type and the registry differ. Owns the
 * cross-cutting concerns: the `auth` subcommand, account binding, tool listing
 * (input + output JSON Schema), dispatch, validation, and error wrapping.
 */
export async function createServer<Client>(options: CreateServerOptions<Client>): Promise<void> {
  const { name, version = '0.0.0', tools, client, runAuth } = options;

  if (process.argv[2] === 'auth') {
    if (!runAuth) {
      console.error(`${name}: no auth flow configured.`);
      process.exit(1);
    }
    await runAuth(process.argv[3] ?? process.env.GOOGLE_MCP_ACCOUNT);
    process.exit(0);
  }

  const authed = await client(process.env.GOOGLE_MCP_ACCOUNT);
  const server = new Server({ name, version }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.entries(tools).map(([toolName, tool]) => ({
      name: toolName,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.input) as Record<string, unknown>,
      outputSchema: zodToJsonSchema(tool.output) as Record<string, unknown>,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, (request) =>
    callTool(tools, authed, request.params.name, request.params.arguments),
  );

  await server.connect(new StdioServerTransport());
}
