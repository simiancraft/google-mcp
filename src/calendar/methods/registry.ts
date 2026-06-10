import type { calendar_v3 } from '@googleapis/calendar';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * REST-sourced operations (beyond the MCP toolset), sourced from
 * `developers.google.com/workspace/calendar/api/v3/reference`. Same wire
 * surface as tools; merged into the registry by the server. Irreversible ones
 * (permanent delete, clear) carry `destructive`.
 */
export const methods = {} satisfies Record<string, AnyOperation<calendar_v3.Calendar>>;
