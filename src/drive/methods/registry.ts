import type { drive_v3 } from '@googleapis/drive';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * REST-sourced operations (beyond the MCP toolset), sourced from
 * `developers.google.com/workspace/drive/api/reference/rest/v3`. Same wire
 * surface as tools; merged into the registry by the server. Irreversible ones
 * (permanent delete, empty trash) carry `destructive`.
 */
export const methods: Record<string, AnyOperation<drive_v3.Drive>> = {};
