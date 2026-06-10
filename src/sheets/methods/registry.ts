import type { sheets_v4 } from '@googleapis/sheets';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * REST-sourced operations, from
 * `developers.google.com/workspace/sheets/api/reference/rest`. Google
 * publishes no MCP toolset for Sheets, so there is no `tools/` folder and
 * this registry is the service's whole wire surface. Irreversible ones (the
 * clears) carry `destructive`.
 */
export const methods = {} satisfies Record<string, AnyOperation<sheets_v4.Sheets>>;
