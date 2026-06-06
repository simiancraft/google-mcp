#!/usr/bin/env node
import { authorizedClient, runAuthFlow } from '@google-mcp/auth';
import { createServer } from '@google-mcp/harness';
import { gmail } from '@googleapis/gmail';
import { methods } from './methods/index.js';
import { tools } from './tools/index.js';

await createServer({
  name: 'gmail',
  version: '0.0.0',
  tools,
  methods,
  client: async (account) => gmail({ version: 'v1', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
