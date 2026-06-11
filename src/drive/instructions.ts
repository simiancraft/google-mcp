/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import { SOURCE_META_KEY } from '../lib/operation.js';
import { identityInstructions } from '../lib/server.js';

export const instructions =
  identityInstructions('Google account') +
  "Operation vocabulary transcribes Google's documentation: tools keep the " +
  "MCP toolset's parameter names, methods keep REST's, and every tools/list " +
  'entry links its source reference page under ' +
  `_meta['${SOURCE_META_KEY}'] and carries the four MCP behavior hints.`;
