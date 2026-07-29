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
  'free/busy is unreadable. Calendar sharing is a list of access control ' +
  'rules, read with list_acl_rules and get_acl_rule and changed with ' +
  'add_acl_rule, update_acl_rule, patch_acl_rule, and delete_acl_rule. ' +
  'A rule ID derives from its scope, and granting owner lets that scope ' +
  "change the calendar's own sharing. The three writes other than " +
  'delete_acl_rule take sendNotifications, which Google enables by default, ' +
  'so sharing notifications remain enabled unless it is passed as false; ' +
  'access removal never notifies. A scope of type default is the public ' +
  'scope and carries no value, while the other types require one.';
