import type { drive_v3 } from '@googleapis/drive';
import type { AnyOperation } from '../../lib/operation.js';
import { create_comment } from './create_comment/index.js';
import { create_reply } from './create_reply/index.js';
import { create_shared_drive } from './create_shared_drive/index.js';
import { delete_comment } from './delete_comment/index.js';
import { delete_file } from './delete_file/index.js';
import { delete_reply } from './delete_reply/index.js';
import { delete_revision } from './delete_revision/index.js';
import { delete_shared_drive } from './delete_shared_drive/index.js';
import { empty_trash } from './empty_trash/index.js';
import { get_about } from './get_about/index.js';
import { get_comment } from './get_comment/index.js';
import { get_reply } from './get_reply/index.js';
import { get_revision } from './get_revision/index.js';
import { get_shared_drive } from './get_shared_drive/index.js';
import { hide_shared_drive } from './hide_shared_drive/index.js';
import { list_comments } from './list_comments/index.js';
import { list_replies } from './list_replies/index.js';
import { list_revisions } from './list_revisions/index.js';
import { list_shared_drives } from './list_shared_drives/index.js';
import { trash_file } from './trash_file/index.js';
import { unhide_shared_drive } from './unhide_shared_drive/index.js';
import { untrash_file } from './untrash_file/index.js';
import { update_comment } from './update_comment/index.js';
import { update_file } from './update_file/index.js';
import { update_reply } from './update_reply/index.js';
import { update_revision } from './update_revision/index.js';
import { update_shared_drive } from './update_shared_drive/index.js';

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
  // comments
  list_comments,
  get_comment,
  create_comment,
  update_comment,
  delete_comment,
  // replies
  list_replies,
  get_reply,
  create_reply,
  update_reply,
  delete_reply,
  // revisions
  list_revisions,
  get_revision,
  update_revision,
  delete_revision,
  // shared drives
  list_shared_drives,
  get_shared_drive,
  create_shared_drive,
  update_shared_drive,
  delete_shared_drive,
  hide_shared_drive,
  unhide_shared_drive,
  // account
  get_about,
} satisfies Record<string, AnyOperation<drive_v3.Drive>>;
