import type { gmail_v1 } from '@googleapis/gmail';
import type { AnyOperation } from '../../lib/operation.js';
import { create_draft } from './create_draft/index.js';
import { create_label } from './create_label/index.js';
import { get_thread } from './get_thread/index.js';
import { label_message } from './label_message/index.js';
import { label_thread } from './label_thread/index.js';
import { list_drafts } from './list_drafts/index.js';
import { list_labels } from './list_labels/index.js';
import { search_threads } from './search_threads/index.js';
import { unlabel_message } from './unlabel_message/index.js';
import { unlabel_thread } from './unlabel_thread/index.js';

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
} satisfies Record<string, AnyOperation<gmail_v1.Gmail>>;
