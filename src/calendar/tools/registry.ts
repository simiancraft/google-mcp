import type { calendar_v3 } from '@googleapis/calendar';
import type { AnyOperation } from '../../lib/operation.js';
import { create_event } from './create_event/index.js';
import { delete_event } from './delete_event/index.js';
import { get_event } from './get_event/index.js';
import { list_events } from './list_events/index.js';
import { respond_to_event } from './respond_to_event/index.js';
import { update_event } from './update_event/index.js';

/**
 * The tool registry: keys are the wire tool names, mirroring Google's Calendar
 * MCP toolset reference. Each tool is imported from its folder and spread in
 * here; the server lists and dispatches this.
 */
export const tools = {
  list_events,
  get_event,
  create_event,
  update_event,
  delete_event,
  respond_to_event,
} satisfies Record<string, AnyOperation<calendar_v3.Calendar>>;
