import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Google parses the text into a title, time, and location (the same parser as
 * the Calendar UI's quick-add box). For structured input use create_event,
 * which controls each field explicitly.
 */
export const quick_add_event = calendarOperation({
  description: 'Create an event from a natural-language description.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/events/quickAdd',
  schema,
  handler,
});
