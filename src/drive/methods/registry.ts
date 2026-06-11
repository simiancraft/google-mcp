import type { drive_v3 } from '@googleapis/drive';
import type { AnyOperation } from '../../lib/operation.js';
import { delete_file } from './delete_file/index.js';
import { empty_trash } from './empty_trash/index.js';
import { trash_file } from './trash_file/index.js';
import { untrash_file } from './untrash_file/index.js';
import { update_file } from './update_file/index.js';

/**
 * REST-sourced operations (beyond the MCP toolset), sourced from
 * `developers.google.com/workspace/drive/api/reference/rest/v3`. Same wire
 * surface as tools; merged into the registry by the server. Irreversible ones
 * (permanent delete, empty trash) carry `destructive`.
 */
export const methods = {
  // files
  update_file,
  trash_file,
  untrash_file,
  delete_file,
  empty_trash,
} satisfies Record<string, AnyOperation<drive_v3.Drive>>;
