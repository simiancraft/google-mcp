import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/colors/get
 *
 * The global palettes that colorId fields refer to: an event's colorId indexes
 * the event palette, and a calendar list entry's colorId indexes the calendar
 * palette. The palettes are account-independent constants.
 */
export const get_colors = calendarOperation({
  description: 'Get the color palettes for calendars and events, keyed by color ID.',
  schema,
  handler,
});
