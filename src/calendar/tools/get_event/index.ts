import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/get_event */
export const get_event = calendarOperation({
  description: 'Get a single event from a calendar by id.',
  schema,
  handler,
});
