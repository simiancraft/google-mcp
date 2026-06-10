import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/settings/get
 * One user setting by id; list_settings enumerates the available ids.
 */
export const get_setting = calendarOperation({
  description: 'Get a single user setting by id.',
  schema,
  handler,
});
