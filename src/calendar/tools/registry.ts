import type { calendar_v3 } from '@googleapis/calendar';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * The tool registry: keys are the wire tool names, mirroring Google's Calendar
 * MCP toolset reference. Each tool is imported from its folder and spread in
 * here; the server lists and dispatches this.
 */
export const tools = {} satisfies Record<string, AnyOperation<calendar_v3.Calendar>>;
