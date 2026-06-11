#!/usr/bin/env node
import { gmail } from '@googleapis/gmail';
import { authorizedClient, runAuthFlow } from '../auth/oauth.js';
import { mergeOperations } from '../lib/operation.js';
import { server } from '../lib/server.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

// Cloning this for a new service? Add that service's OAuth scopes to `SCOPES` in
// src/auth/config.ts BEFORE the first auth. The scope union is front-loaded so each
// account consents once, and Google only re-issues a refresh token on a fresh grant;
// adding a scope later forces re-consent of every account. Nothing in this file
// references scopes, which is exactly why it is easy to miss.
// Served in the MCP initialize result; clients inject this into the agent's
// context at connect time, so it is the one server-authored string an agent
// reliably reads before calling tools.
const instructions =
  'This server is bound to exactly one Gmail account, fixed at startup; no ' +
  'operation takes an account parameter, so to act on a different account, use ' +
  "that account's instance. Operation vocabulary transcribes Google's " +
  "documentation: tools keep the MCP toolset's parameter names, methods keep " +
  "REST's, and every tools/list entry links its source reference page under " +
  "_meta['com.simiancraft.google-mcp/source'] and carries the four MCP " +
  'behavior hints. Heed the hints: sends are irreversible and reach external ' +
  'recipients; permanent deletes bypass the trash entirely (trash_* and ' +
  'untrash_* are the reversible pair); create_filter installs a standing rule ' +
  'that keeps acting on future mail. Attachment bytes return base64url-encoded ' +
  'in JSON.';

await server({
  name: 'gmail',
  title: 'Gmail (google-mcp-suite)',
  description:
    'Per-account Gmail MCP server: threads, messages, drafts, labels, filters, and attachments.',
  instructions,
  operations: mergeOperations(tools, methods),
  client: async (account) => gmail({ version: 'v1', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
