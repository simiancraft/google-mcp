#!/usr/bin/env node
import { sheets } from '@googleapis/sheets';
import { authorizedClient, runAuthFlow } from '../auth/oauth.js';
import { mergeOperations } from '../lib/operation.js';
import { server } from '../lib/server.js';
import { methods } from './methods/registry.js';

// Cloning this for a new service? Add that service's OAuth scopes to `SCOPES` in
// src/auth/config.ts BEFORE the first auth. The scope union is front-loaded so each
// account consents once, and Google only re-issues a refresh token on a fresh grant;
// adding a scope later forces re-consent of every account. Nothing in this file
// references scopes, which is exactly why it is easy to miss.
//
// Sheets is methods-only: Google publishes no MCP toolset for Sheets (its
// MCP-supported products are Gmail, Drive, Calendar, Chat, and People), so there
// is no tools/ folder and the REST-sourced methods are the whole surface.
await server({
  name: 'sheets',
  operations: mergeOperations(methods),
  client: async (account) => sheets({ version: 'v4', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
