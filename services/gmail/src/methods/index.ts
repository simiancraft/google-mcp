import type { AnyTool } from '@google-mcp/harness';
import type { gmail_v1 } from 'googleapis';
import { delete_message } from './delete_message/handler.js';
import { get_message } from './get_message/handler.js';
import { send_draft } from './send_draft/handler.js';
import { trash_message } from './trash_message/handler.js';
import { untrash_message } from './untrash_message/handler.js';

/**
 * REST-sourced operations (beyond the MCP toolset), sourced from
 * `developers.google.com/workspace/gmail/api/reference/rest`. Same wire surface
 * as tools; merged into the registry by the server. Irreversible ones (send,
 * permanent delete) carry `destructive`.
 */
export const methods: Record<string, AnyTool<gmail_v1.Gmail>> = {
  get_message,
  send_draft,
  trash_message,
  untrash_message,
  delete_message,
};
