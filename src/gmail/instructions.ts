/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import { SOURCE_META_KEY } from '../lib/operation.js';
import { identityInstructions } from '../lib/server.js';

export const instructions =
  identityInstructions('Gmail account') +
  "Operation vocabulary transcribes Google's documentation: tools keep the " +
  "MCP toolset's parameter names, methods keep REST's, and every tools/list " +
  `entry links its source reference page under _meta['${SOURCE_META_KEY}'] ` +
  'and carries the four MCP behavior hints. Heed the hints: sends are ' +
  'irreversible and reach external recipients; permanent deletes bypass the ' +
  'trash entirely (trash_* and untrash_* are the reversible pair, and Gmail ' +
  'purges trashed mail after about 30 days); create_filter installs a ' +
  'standing rule that keeps acting on future mail. Attachment bytes are ' +
  'returned base64url-encoded in JSON.';
