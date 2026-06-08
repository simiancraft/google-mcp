#!/usr/bin/env node
import { gmail } from '@googleapis/gmail';
import { authorizedClient, runAuthFlow } from '../auth/index.js';
import { createServer } from '../harness/index.js';
import { methods } from './methods/index.js';
import { tools } from './tools/index.js';

// Cloning this for a new service? Add that service's OAuth scopes to `SCOPES` in
// packages/google-auth/src/config.ts BEFORE the first auth. The scope union is
// front-loaded so each account consents once, and Google only re-issues a refresh
// token on a fresh grant; adding a scope later forces re-consent of every account.
// Nothing in this file references scopes, which is exactly why it is easy to miss.
await createServer({
  name: 'gmail',
  tools,
  methods,
  client: async (account) => gmail({ version: 'v1', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
