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
  "MCP toolset's parameter names (startTime, pageSize, notificationLevel), " +
  "methods keep REST's (timeMin, maxResults, sendUpdates), and every " +
  'tools/list entry links its source reference page under ' +
  `_meta['${SOURCE_META_KEY}'] and carries the four MCP behavior hints. ` +
  'Event start and end take exactly one of date (all-day) or dateTime ' +
  '(timed); timeZone is required for recurring events. Writes that touch ' +
  'attendees can email guests, controlled by notificationLevel on tools and ' +
  'sendUpdates on methods. suggest_time refuses to answer, rather than ' +
  "proposing slots that may conflict, when any requested calendar's " +
  'free/busy is unreadable.';
