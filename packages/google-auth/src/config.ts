import os from 'node:os';
import path from 'node:path';

/**
 * Canonical credential layout (all overridable by env for verification / testing):
 *
 *   <CONFIG_DIR>/client_secret.json   shared OAuth app
 *   <CONFIG_DIR>/tokens/<account>.json  per-account, all-scopes token
 *
 * Env overrides:
 *   GOOGLE_MCP_DIR            the config dir (default ~/.google-mcp)
 *   GOOGLE_MCP_CLIENT_SECRET  path to the client secret JSON
 *   GOOGLE_MCP_TOKEN          path to a specific token file (single-account override)
 *   GOOGLE_MCP_ACCOUNT        which account this instance is bound to
 *
 * These read the environment lazily (not at import time) so a host can set them
 * before calling, and so verification can point at the legacy ~/.gmail-mcp-* dirs.
 */

export function configDir(): string {
  return process.env.GOOGLE_MCP_DIR ?? path.join(os.homedir(), '.google-mcp');
}

export function tokensDir(): string {
  return path.join(configDir(), 'tokens');
}

export function clientSecretPath(): string {
  return process.env.GOOGLE_MCP_CLIENT_SECRET ?? path.join(configDir(), 'client_secret.json');
}

export function tokenPath(account: string): string {
  return process.env.GOOGLE_MCP_TOKEN ?? path.join(tokensDir(), `${account}.json`);
}

/**
 * Account names become path segments (`tokens/<account>.json`), so they must not
 * contain path separators or traversal sequences. Allow letters, digits, and the
 * handful of punctuation marks that appear in email addresses and simple slugs.
 */
const SAFE_ACCOUNT = /^[A-Za-z0-9._%+@-]+$/;

export function resolveAccount(account?: string): string {
  const resolved = account ?? process.env.GOOGLE_MCP_ACCOUNT;
  if (!resolved) {
    throw new Error('No account selected; set GOOGLE_MCP_ACCOUNT or pass an account.');
  }
  if (!SAFE_ACCOUNT.test(resolved) || resolved.includes('..')) {
    throw new Error(
      `Invalid account name "${resolved}": only letters, digits, and . _ % + @ - are allowed.`,
    );
  }
  return resolved;
}

/**
 * Front-loaded scope union across all planned services. Gmail entries are
 * present now; Drive, Sheets, Docs, and Calendar scopes join here when those
 * services land, so each account is authorized once for everything.
 */
export const SCOPES = [
  // Front-loaded union across all planned services, so each account is authorized
  // once for everything (the B1 model). The consent screen must list these too.
  // Gmail — mail.google.com is full access incl. permanent delete (gmail.modify
  // cannot delete); settings.basic covers filters/forwarding/vacation/aliases.
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  // Drive
  'https://www.googleapis.com/auth/drive',
  // Sheets
  'https://www.googleapis.com/auth/spreadsheets',
  // Docs
  'https://www.googleapis.com/auth/documents',
  // Calendar
  'https://www.googleapis.com/auth/calendar',
];
