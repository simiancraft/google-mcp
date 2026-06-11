import type { drive_v3 } from '@googleapis/drive';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * The tool registry: keys are the wire tool names, mirroring Google's Drive
 * MCP toolset reference. Each tool is imported from its folder and spread in
 * here; the server lists and dispatches this.
 */
export const tools: Record<string, AnyOperation<drive_v3.Drive>> = {};
