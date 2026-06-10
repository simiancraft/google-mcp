#!/usr/bin/env node
// Regenerate CAPABILITIES.md from the live method registry: `bun run
// capabilities`. The doc is derived from the same registry the server lists
// and dispatches, so it cannot drift from the code. Agents that speak MCP should
// discover the live, fully-schema'd surface via the server's `tools/list`.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderCapabilities } from '../lib/server.js';
import { methods } from './methods/registry.js';

if (import.meta.main) {
  const out = fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url));
  writeFileSync(
    out,
    renderCapabilities('Sheets capabilities', [{ kind: 'REST Method', operations: methods }]),
  );
  console.error(`Wrote CAPABILITIES.md (${Object.keys(methods).length} operations)`);
}
