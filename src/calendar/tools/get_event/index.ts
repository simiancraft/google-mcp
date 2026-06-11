import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const get_event = calendarOperation({
  description: 'Get a single event from a calendar by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/get_event',
  schema,
  handler,
});
