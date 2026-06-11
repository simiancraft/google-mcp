import type { drive_v3 } from '@googleapis/drive';
import type { AnyOperation } from '../../lib/operation.js';
import { get_file_metadata } from './get_file_metadata/index.js';
import { get_file_permissions } from './get_file_permissions/index.js';
import { list_recent_files } from './list_recent_files/index.js';
import { search_files } from './search_files/index.js';

/**
 * The tool registry: keys are the wire tool names, mirroring Google's Drive
 * MCP toolset reference. Each tool is imported from its folder and spread in
 * here; the server lists and dispatches this.
 */
export const tools = {
  search_files,
  list_recent_files,
  get_file_metadata,
  get_file_permissions,
} satisfies Record<string, AnyOperation<drive_v3.Drive>>;
