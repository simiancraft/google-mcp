/**
 * Admin web UI for managing google-mcp-suite credentials.
 *
 * Writes the exact files the stdio servers read (see `src/auth/config.ts` /
 * `src/auth/oauth.ts`):
 *
 *   <GOOGLE_MCP_DIR>/client_secret.json     shared OAuth app  (0600)
 *   <GOOGLE_MCP_DIR>/tokens/<account>.json  per-account token (0600, 0700 dir)
 *
 * This barrel exposes the surface the HTTP server needs; the sibling modules
 * hold the implementation (paths, clientSecret, accounts, oauth, web, routes).
 */
export { accountAuthorized, authorizedAccounts } from './accounts.js';
export { validAccount } from './paths.js';
export { mountAdmin } from './routes.js';
