import type { calendar_v3 } from '@googleapis/calendar';
import type { AnyOperation } from '../../lib/operation.js';
import { add_calendar_entry } from './add_calendar_entry/index.js';
import { clear_calendar } from './clear_calendar/index.js';
import { create_calendar } from './create_calendar/index.js';
import { delete_calendar } from './delete_calendar/index.js';
import { get_calendar } from './get_calendar/index.js';
import { get_calendar_entry } from './get_calendar_entry/index.js';
import { list_event_instances } from './list_event_instances/index.js';
import { move_event } from './move_event/index.js';
import { patch_event } from './patch_event/index.js';
import { quick_add_event } from './quick_add_event/index.js';
import { remove_calendar_entry } from './remove_calendar_entry/index.js';
import { update_calendar } from './update_calendar/index.js';
import { update_calendar_entry } from './update_calendar_entry/index.js';

/**
 * REST-sourced operations (beyond the MCP toolset), sourced from
 * `developers.google.com/workspace/calendar/api/v3/reference`. Same wire
 * surface as tools; merged into the registry by the server. Irreversible ones
 * (permanent delete, clear) carry `destructive`.
 */
export const methods = {
  // events
  list_event_instances,
  move_event,
  quick_add_event,
  patch_event,
  // calendars
  get_calendar,
  create_calendar,
  update_calendar,
  delete_calendar,
  clear_calendar,
  // calendar list entries
  get_calendar_entry,
  add_calendar_entry,
  update_calendar_entry,
  remove_calendar_entry,
} satisfies Record<string, AnyOperation<calendar_v3.Calendar>>;
