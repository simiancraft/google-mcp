/**
 * The HTTP surface for the suite: it fronts the stdio MCP servers
 * (gmail / calendar / sheets / docs / drive) and exposes each one over the
 * network as a Streamable HTTP MCP endpoint at `/<account>/<service>`, where
 * `<account>` is an account authorized via the /admin UI.
 *
 * Identity in this suite is bound one-account-per-process, so each HTTP session
 * spawns its own child stdio server (the very same `google-mcp-<service>` bin)
 * bound to `<account>` via `GOOGLE_MCP_ACCOUNT`, and JSON-RPC messages are
 * bridged transparently between the HTTP transport and the child's stdin/stdout.
 * Multiplexing many accounts through one HTTP server never mixes their
 * credentials: each account lives in its own process.
 */
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import express, { type NextFunction, type Request, type Response } from 'express';
import { accountAuthorized, authorizedAccounts, mountAdmin, validAccount } from './admin/index.js';

// --- Configuration -----------------------------------------------------------

export const PORT = Number(process.env['PORT'] ?? 3000);
export const HOST = process.env['HOST'] ?? '0.0.0.0';
const AUTH_TOKEN = process.env['AUTH_TOKEN']?.trim() || undefined;
const BODY_LIMIT = process.env['BODY_LIMIT'] ?? '50mb';

// The compiled bins live next to this module (dist/serve/http.js -> dist/<service>/index.js).
const SERVE_DIR = dirname(fileURLToPath(import.meta.url));

/** Map of URL path segment -> the service whose stdio bin is spawned for it. */
export const SERVICES = ['gmail', 'calendar', 'sheets', 'docs', 'drive'] as const;
type Service = (typeof SERVICES)[number];

function isService(name: string): name is Service {
  return (SERVICES as readonly string[]).includes(name);
}

/** A single route parameter as a plain string (Express 5 types params as string | string[]). */
function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

/** The compiled entry point of a service's stdio server. */
function serviceEntry(service: Service): string {
  return resolve(SERVE_DIR, '..', service, 'index.js');
}

// --- Session bridging --------------------------------------------------------

interface Session {
  account: string;
  service: string;
  http: StreamableHTTPServerTransport;
  child: StdioClientTransport;
}

const sessions = new Map<string, Session>();

/** Build the environment for a child server, binding it to `account`. */
function childEnv(account: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) env[k] = v;
  }
  // The child reads GOOGLE_MCP_ACCOUNT for its identity; it comes from the URL
  // (/<account>/<service>), never inherited from the server's environment.
  env['GOOGLE_MCP_ACCOUNT'] = account;
  return env;
}

/** Spawn a child stdio server bound to `account` and wire it to a fresh Streamable HTTP transport. */
async function createSession(account: string, service: Service): Promise<Session> {
  const label = `${account}/${service}`;
  const child = new StdioClientTransport({
    command: process.execPath,
    args: [serviceEntry(service)],
    env: childEnv(account),
    stderr: 'inherit', // surface auth / google-mcp diagnostics in our logs
  });

  const http = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId) => {
      sessions.set(sessionId, session);
      console.log(`[${label}] session opened: ${sessionId}`);
    },
  });

  const session: Session = { account, service, http, child };

  // Transparent JSON-RPC bridge in both directions.
  http.onmessage = (msg) => {
    child.send(msg).catch((err) => console.error(`[${label}] -> child send failed`, err));
  };
  child.onmessage = (msg) => {
    http.send(msg).catch((err) => console.error(`[${label}] -> http send failed`, err));
  };

  let closed = false;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    if (http.sessionId) sessions.delete(http.sessionId);
    void child.close().catch(() => {});
    void http.close().catch(() => {});
    console.log(`[${label}] session closed: ${http.sessionId ?? '(uninitialized)'}`);
  };

  http.onclose = cleanup;
  child.onclose = cleanup;
  http.onerror = (err) => console.error(`[${label}] http transport error`, err);
  child.onerror = (err) => console.error(`[${label}] child transport error`, err);

  await child.start();
  await http.start();
  return session;
}

/** Tear down every open session (used on shutdown). */
export function closeAllSessions(): void {
  for (const session of sessions.values()) {
    void session.child.close().catch(() => {});
    void session.http.close().catch(() => {});
  }
}

// --- HTTP app ----------------------------------------------------------------

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!AUTH_TOKEN) return next();
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  if (token !== AUTH_TOKEN) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
}

function jsonRpcError(res: Response, status: number, message: string) {
  res.status(status).json({ jsonrpc: '2.0', error: { code: -32000, message }, id: null });
}

function getSession(req: Request): Session | undefined {
  const id = req.headers['mcp-session-id'];
  const sessionId = Array.isArray(id) ? id[0] : id;
  if (!sessionId) return undefined;
  const session = sessions.get(sessionId);
  if (
    !session ||
    session.account !== param(req.params['account']) ||
    session.service !== param(req.params['service'])
  ) {
    return undefined;
  }
  return session;
}

/** Server -> client stream (GET, SSE) and session teardown (DELETE). */
async function handleSessionRequest(req: Request, res: Response) {
  const session = getSession(req);
  if (!session) return jsonRpcError(res, 400, 'no valid session for the given Mcp-Session-Id');
  try {
    await session.http.handleRequest(req, res);
  } catch (err) {
    console.error(`[${session.account}/${session.service}] stream request failed`, err);
    if (!res.headersSent) jsonRpcError(res, 500, 'internal error');
  }
}

/** Build the Express app: the /admin credential UI plus the `/<account>/<service>` MCP endpoints. */
export function buildApp() {
  const app = express();
  app.use(express.json({ limit: BODY_LIMIT }));

  // Credential-management web UI at /admin (client secret + per-account OAuth).
  mountAdmin(app);

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true, services: SERVICES, sessions: sessions.size });
  });

  app.get('/', (_req, res) => {
    res.json({
      name: 'google-mcp-suite',
      transport: 'streamable-http',
      route: '/{account}/{service}',
      services: SERVICES,
      accounts: authorizedAccounts(),
      admin: '/admin',
    });
  });

  // Client -> server requests (initialize + tool calls), addressed as /<account>/<service>.
  app.post('/:account/:service', requireAuth, async (req, res) => {
    const account = param(req.params['account']);
    const service = param(req.params['service']);
    if (!validAccount(account)) return jsonRpcError(res, 400, `invalid account: ${account}`);
    if (!isService(service)) return jsonRpcError(res, 404, `unknown service: ${service}`);
    if (!accountAuthorized(account)) {
      return jsonRpcError(res, 404, `account not authorized: ${account} (authorize it at /admin)`);
    }

    try {
      let session = getSession(req);
      if (!session) {
        if (req.headers['mcp-session-id'] || !isInitializeRequest(req.body)) {
          return jsonRpcError(res, 400, 'no valid session for the given Mcp-Session-Id');
        }
        session = await createSession(account, service);
      }
      await session.http.handleRequest(req, res, req.body);
    } catch (err) {
      console.error(`[${account}/${service}] request failed`, err);
      if (!res.headersSent) jsonRpcError(res, 500, 'internal error');
    }
  });

  app.get('/:account/:service', requireAuth, handleSessionRequest);
  app.delete('/:account/:service', requireAuth, handleSessionRequest);

  return app;
}
