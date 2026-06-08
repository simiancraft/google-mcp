#!/usr/bin/env node
// Regenerate CAPABILITIES.md from the live tool/method registries: `bun run
// capabilities`. The doc is derived from the same registries the server lists
// and dispatches, so it cannot drift from the code. Agents that speak MCP should
// discover the live, fully-schema'd surface via the server's `tools/list`.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderCapabilities } from '../harness/index.js';
import { methods } from './methods/index.js';
import { tools } from './tools/index.js';

if (import.meta.main) {
  const registry = { ...tools, ...methods };
  const out = fileURLToPath(new URL('../../CAPABILITIES.md', import.meta.url));
  writeFileSync(out, renderCapabilities('Gmail capabilities', registry));
  console.error(`Wrote CAPABILITIES.md (${Object.keys(registry).length} operations)`);
}
