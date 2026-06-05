import { defineTool } from '../../defineTool.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/get_thread
 *
 * MINIMAL maps to the REST `metadata` format (headers + snippet); FULL_CONTENT
 * (the default) maps to `full`, which carries the MIME tree projected to
 * plaintext bodies and attachment ids.
 */
export const get_thread = defineTool({
  description: 'Get a thread and its messages by id.',
  input,
  output,
  handler: async (gmail, args) => {
    const format = args.messageFormat === 'MINIMAL' ? 'metadata' : 'full';
    const { data } = await gmail.users.threads.get({
      userId: 'me',
      id: args.threadId,
      format,
    });
    return {
      id: data.id ?? args.threadId,
      messages: (data.messages ?? []).map(projectMessage),
    };
  },
});
