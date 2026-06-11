import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One user setting by id; list_settings enumerates the available ids.
 */
export const get_setting = calendarOperation({
  description: 'Get a single user setting by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/settings/get',
  schema,
  handler,
});
