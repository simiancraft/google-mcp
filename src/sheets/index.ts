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
// Served in the MCP initialize result; clients inject this into the agent's
// context at connect time, so it is the one server-authored string an agent
// reliably reads before calling tools.
const instructions =
  'This server is bound to exactly one Google account, fixed at startup; no ' +
  'operation takes an account parameter, so to act on a different account, use ' +
  "that account's instance. Google publishes no MCP toolset for Sheets, so " +
  'every operation transcribes the REST reference; each tools/list entry links ' +
  "its source page under _meta['com.simiancraft.google-mcp/source'] and " +
  'carries the four MCP behavior hints. Ranges use A1 notation (or R1C1); cell ' +
  'data moves as 2D arrays of string, number, boolean, or null values, the ' +
  'values field is absent entirely for an empty range, and rows may be ragged. ' +
  'Every write requires valueInputOption: RAW stores text as-is, USER_ENTERED ' +
  'parses values as if typed, so a leading = becomes a live formula; write ' +
  'untrusted content with RAW. append_values searches its range for a table ' +
  'and appends after it. The spreadsheet projection is metadata-only, and the ' +
  "Sheets API has no delete; removing a spreadsheet is Drive's files.delete.";

await server({
  name: 'sheets',
  title: 'Google Sheets (google-mcp-suite)',
  description:
    'Per-account Google Sheets MCP server: spreadsheets, values, batch and data-filter reads and writes, and developer metadata.',
  instructions,
  operations: mergeOperations(methods),
  client: async (account) => sheets({ version: 'v4', auth: await authorizedClient(account) }),
  runAuth: runAuthFlow,
});
