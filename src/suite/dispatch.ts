/**
 * The suite's front door: one bin named after the package, so `npx google-mcp-suite
 * <service>` works. Registry-fed MCP clients construct exactly `npx <package>` from a
 * server.json entry, and npx can only run a bin whose name matches the package, so the
 * package name must be runnable; the service argument is what lets one registry entry
 * cover every server in the suite. The suite knows the services; no service imports it.
 */
export const services = ['gmail', 'calendar', 'drive', 'docs', 'sheets'] as const;

// A Map, not an object literal: lookup must miss on inherited keys ('constructor').
const entries = new Map<string, string>([
  ...services.map((service) => [service, `../${service}/index.js`] as const),
  ['doctor', '../doctor/index.js'],
  ['serve', '../serve/index.js'],
]);

/**
 * The module specifier to import for a dispatchable name, or undefined. Specifiers
 * resolve against the importing module, so they are only correct from inside this
 * directory (index.ts is a sibling); the drift test pins each one to its bin's target.
 */
export function resolve(name: string): string | undefined {
  return entries.get(name);
}

export const usage = `google-mcp-suite: per-account Google MCP servers, one process per service

Usage:
  google-mcp-suite <service>    start a server on stdio (${services.join(', ')})
  google-mcp-suite serve        serve every service over HTTP (+ optional /admin setup UI)
  google-mcp-suite doctor [...] provisioning + auth health (same as google-mcp-doctor)
  google-mcp-suite help

The account is chosen by the GOOGLE_MCP_ACCOUNT environment variable; run one
instance per service per account. Each server also ships as its own bin
(${services.map((service) => `google-mcp-${service}`).join(', ')}).

Prefer HTTP? \`google-mcp-suite serve\` (or the google-mcp-serve bin) exposes every
service at http://<host>:<port>/<account>/<service> and, with ADMIN_PASSWORD set,
a /admin web UI for the one-time OAuth setup — so one host can serve many clients.`;
