#!/usr/bin/env node
/**
 * `google-mcp-serve` — the suite's HTTP entry point (also `google-mcp-suite serve`).
 *
 * Where each `google-mcp-<service>` bin speaks MCP over stdio, this serves every
 * service over Streamable HTTP at `/<account>/<service>` and, when
 * `ADMIN_PASSWORD` is set, hosts a `/admin` web UI for the one-time OAuth setup.
 * It is the transport choice — stdio for a single client, HTTP to run once on a
 * host and point many MCP clients at it — nothing else changes.
 */
import { buildApp, closeAllSessions, HOST, PORT, SERVICES } from './http.js';

const app = buildApp();

const server = app.listen(PORT, HOST, () => {
  console.log(`google-mcp-suite listening on http://${HOST}:${PORT}`);
  console.log(`services: ${SERVICES.join(', ')}`);
  if (!process.env['AUTH_TOKEN']?.trim())
    console.warn('AUTH_TOKEN is not set — the /<account>/<service> endpoints are unauthenticated.');
  if (!process.env['ADMIN_PASSWORD']?.trim())
    console.warn('ADMIN_PASSWORD is not set — the /admin credential UI is disabled (returns 503).');
});

function shutdown(signal: string) {
  console.log(`received ${signal}, shutting down...`);
  server.close();
  closeAllSessions();
  setTimeout(() => process.exit(0), 1000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
