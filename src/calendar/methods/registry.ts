import type { calendar_v3 } from '@googleapis/calendar';
import type { AnyOperation } from '../../lib/operation.js';
import { list_event_instances } from './list_event_instances/index.js';
import { move_event } from './move_event/index.js';
import { patch_event } from './patch_event/index.js';
import { quick_add_event } from './quick_add_event/index.js';

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
} satisfies Record<string, AnyOperation<calendar_v3.Calendar>>;
