#!/usr/bin/env node
// Regenerate CAPABILITIES.md from the live method registry: `bun run
// capabilities`. The doc is derived from the same registry the server lists
// and dispatches, so it cannot drift from the code. Agents that speak MCP should
// discover the live, fully-schema'd surface via the server's `tools/list`.
import { writeCapabilities } from '../lib/capabilities.js';
import { methods } from './methods/registry.js';

if (import.meta.main) {
  writeCapabilities(import.meta.url, 'Docs capabilities', [
    { kind: 'REST Method', operations: methods },
  ]);
}
