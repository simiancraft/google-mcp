import type { AnyTool } from '@google-mcp/harness';
import type { gmail_v1 } from '@googleapis/gmail';
import { create_draft } from './create_draft/handler.js';
import { create_label } from './create_label/handler.js';
import { get_thread } from './get_thread/handler.js';
import { label_message } from './label_message/handler.js';
import { label_thread } from './label_thread/handler.js';
import { list_drafts } from './list_drafts/handler.js';
import { list_labels } from './list_labels/handler.js';
import { search_threads } from './search_threads/handler.js';
import { unlabel_message } from './unlabel_message/handler.js';
import { unlabel_thread } from './unlabel_thread/handler.js';

/**
 * The tool registry: keys are the wire tool names. Each tool is imported from
 * its folder's handler and spread in here; the server lists and dispatches this.
 */
export const tools = {
  search_threads,
  get_thread,
  list_drafts,
  create_draft,
  list_labels,
  create_label,
  label_message,
  label_thread,
  unlabel_message,
  unlabel_thread,
} satisfies Record<string, AnyTool<gmail_v1.Gmail>>;
