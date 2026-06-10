import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/calendar/api/v3/reference/events/patch
 *
 * The fidelity gap-filler for the update_event tool: exposes the REST fields
 * the MCP toolset omits (recurrence, status, transparency, the full attendee
 * shape, extendedProperties, and the guest permissions). Patch semantics:
 * unset fields are left unchanged. Where update_event applies attendee deltas,
 * attendees here, when set, replace the whole guest list.
 */
export const patch_event = calendarOperation({
  description:
    'Patch any REST field of an event, including those update_event omits; unset fields are left unchanged.',
  schema,
  handler,
});
