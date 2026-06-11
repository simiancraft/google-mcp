#!/usr/bin/env node
import { docs } from '@googleapis/docs';
import { authorizedClient, runAuthFlow } from '../auth/oauth.js';
import { mergeOperations } from '../lib/operation.js';
import { server } from '../lib/server.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';

// Cloning this for a new service? Add that service's OAuth scopes to `SCOPES` in
// src/auth/config.ts BEFORE the first auth. The scope union is front-loaded so each
// account consents once, and Google only re-issues a refresh token on a fresh grant;
// adding a scope later forces re-consent of every account. Nothing in this file
// references scopes, which is exactly why it is easy to miss.
//
// Docs is methods-only: Google publishes no MCP toolset for Docs (its
// MCP-supported products are Gmail, Drive, Calendar, Chat, and People), so there
// is no tools/ folder and the REST-sourced methods are the whole surface.
await server({
  name: 'docs',
  title: 'Google Docs (google-mcp-suite)',
  description:
    'Per-account Google Docs MCP server: document reads and creation plus curated text editing and styling.',
  instructions,
  operations: mergeOperations(methods),
  client: async (account) => docs({ version: 'v1', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
