import type { AnyTool } from '@google-mcp/harness';
import type { gmail_v1 } from 'googleapis';
import { list_labels } from './list_labels/handler.js';

/**
 * The tool registry: keys are the wire tool names. Each tool is imported from
 * its folder's handler and spread in here; the server lists and dispatches this.
 */
export const tools: Record<string, AnyTool<gmail_v1.Gmail>> = {
  list_labels,
};
