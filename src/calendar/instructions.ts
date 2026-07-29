/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import {
  identityInstructions,
  untrustedContentInstructions,
  vocabularyInstructions,
} from '../lib/instructions.js';

export const instructions =
  identityInstructions('Google account') +
  vocabularyInstructions({
    tools: 'startTime, pageSize, notificationLevel',
    methods: 'timeMin, maxResults, sendUpdates',
  }) +
  untrustedContentInstructions() +
  'Event start and end take exactly one of date (all-day) or dateTime ' +
  '(timed); timeZone is required for recurring events. Writes that touch ' +
  'attendees can email guests, controlled by notificationLevel on tools and ' +
  'sendUpdates on methods. suggest_time refuses to answer, rather than ' +
  "proposing slots that may conflict, when any requested calendar's " +
  'free/busy is unreadable. The access control rules that constitute ' +
  'calendar sharing are read with list_acl_rules and changed with ' +
  'add_acl_rule, update_acl_rule, patch_acl_rule, and delete_acl_rule; a ' +
  'rule ID derives from its scope, granting owner lets the grantee change ' +
  "the calendar's own sharing, and sendNotifications defaults to true, so a " +
  'grant emails the scope unless it is passed as false.';
