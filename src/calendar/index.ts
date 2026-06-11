#!/usr/bin/env node
import { calendar } from '@googleapis/calendar';
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
  'This server is bound to exactly one Google account, fixed at startup; no ' +
  'operation takes an account parameter, so to act on a different account, use ' +
  "that account's instance. Operation vocabulary transcribes Google's " +
  "documentation: tools keep the MCP toolset's parameter names (startTime, " +
  "pageSize, notificationLevel), methods keep REST's (timeMin, maxResults, " +
  'sendUpdates), and every tools/list entry links its source reference page ' +
  "under _meta['com.simiancraft.google-mcp/source'] and carries the four MCP " +
  'behavior hints. Event start and end take exactly one of date (all-day) or ' +
  'dateTime (timed); timeZone is required for recurring events. Writes that ' +
  'touch attendees can email guests, controlled by notificationLevel on tools ' +
  'and sendUpdates on methods. suggest_time refuses to answer when any ' +
  "requested calendar's free/busy is unreadable rather than proposing slots " +
  'that may conflict.';

await server({
  name: 'calendar',
  title: 'Google Calendar (google-mcp-suite)',
  description:
    'Per-account Google Calendar MCP server: events, calendars, free/busy, and meeting-time suggestions.',
  instructions,
  operations: mergeOperations(tools, methods),
  client: async (account) => calendar({ version: 'v3', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
