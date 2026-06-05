#!/usr/bin/env node
import { authorizedClient, runAuthFlow } from '@google-mcp/auth';
import { createServer } from '@google-mcp/harness';
import { google } from 'googleapis';
import { methods } from './methods/index.js';
import { scopes } from './scopes.js';
import { tools } from './tools/index.js';

await createServer({
  name: 'gmail',
  version: '0.0.0',
  scopes,
  tools,
  methods,
  client: async (account) => google.gmail({ version: 'v1', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
