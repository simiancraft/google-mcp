/**
 * Credential layout for the admin surface. Every path is derived from the
 * suite's own `loadConfig()`, so anything the UI writes lands exactly where the
 * stdio servers read it (`GOOGLE_MCP_DIR` and friends apply identically).
 */
import path from 'node:path';
import { loadConfig } from '../../auth/config.js';

// Re-exported under the name the rest of the admin surface uses. The `<account>`
// URL segment and the token filename (`tokens/<account>.json`) share this rule,
// so a label that validates here is a safe path segment there.
export { isValidAccount as validAccount } from '../../auth/config.js';

/** The config dir the stdio servers read (`GOOGLE_MCP_DIR` overrides `~/.google-mcp`). */
export function googleMcpDir(): string {
  return loadConfig().dir;
}

/** The shared OAuth app credentials file. */
export function clientSecretPath(): string {
  return loadConfig().clientSecretPath;
}

/** The per-account token directory. */
export function tokensDir(): string {
  return loadConfig().tokensDir;
}

/**
 * The token file for `account`. The admin manages many accounts, so it always
 * addresses the per-account path (never the single-account `GOOGLE_MCP_TOKEN`
 * override, which binds one process to one account).
 */
export function tokenPath(account: string): string {
  return path.join(tokensDir(), `${account}.json`);
}
