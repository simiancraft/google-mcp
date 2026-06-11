#!/usr/bin/env node
// Regenerate CAPABILITIES.md from the live tool/method registries: `bun run
// capabilities`. The doc is derived from the same registries the server lists
// and dispatches, so it cannot drift from the code. Agents that speak MCP should
// discover the live, fully-schema'd surface via the server's `tools/list`.
import { writeCapabilities } from '../lib/capabilities.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

if (import.meta.main) {
  writeCapabilities(import.meta.url, 'Gmail capabilities', [
    { kind: 'MCP Tool', operations: tools },
    { kind: 'REST Method', operations: methods },
  ]);
}
