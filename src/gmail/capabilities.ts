#!/usr/bin/env node
// Regenerate CAPABILITIES.md from the live tool/method registries: `bun run
// capabilities`. The doc is derived from the same registries the server lists
// and dispatches, so it cannot drift from the code. Agents that speak MCP should
// discover the live, fully-schema'd surface via the server's `tools/list`.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeOperations } from '../lib/operation.js';
import { renderCapabilities } from '../lib/server.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

if (import.meta.main) {
  const operations = mergeOperations(tools, methods);
  const out = fileURLToPath(new URL('./CAPABILITIES.md', import.meta.url));
  writeFileSync(
    out,
    renderCapabilities('Gmail capabilities', [
      { kind: 'MCP Tool', operations: tools },
      { kind: 'REST Method', operations: methods },
    ]),
  );
  console.error(`Wrote CAPABILITIES.md (${Object.keys(operations).length} operations)`);
}
