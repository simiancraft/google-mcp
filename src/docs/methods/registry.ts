import type { docs_v1 } from '@googleapis/docs';
import type { AnyOperation } from '../../lib/operation.js';
import { create_document } from './create_document/index.js';
import { create_paragraph_bullets } from './create_paragraph_bullets/index.js';
import { delete_content_range } from './delete_content_range/index.js';
import { delete_paragraph_bullets } from './delete_paragraph_bullets/index.js';
import { get_document } from './get_document/index.js';
import { insert_section_break } from './insert_section_break/index.js';
import { insert_text } from './insert_text/index.js';
import { replace_all_text } from './replace_all_text/index.js';
import { update_document_style } from './update_document_style/index.js';
import { update_paragraph_style } from './update_paragraph_style/index.js';
import { update_section_style } from './update_section_style/index.js';
import { update_text_style } from './update_text_style/index.js';

/**
 * REST-sourced operations, from
 * `developers.google.com/workspace/docs/api/reference/rest`. Google publishes
 * no MCP toolset for Docs, so there is no `tools/` folder and this registry is
 * the service's whole wire surface. The curated editing and styling
 * operations each wrap `documents.batchUpdate` with exactly one request type;
 * the rest of the 40-variant union is issue #35.
 */
export const methods = {
  // documents
  get_document,
  create_document,
  // text editing (curated batchUpdate requests)
  insert_text,
  replace_all_text,
  delete_content_range,
  // styling (curated batchUpdate requests)
  update_text_style,
  update_paragraph_style,
  create_paragraph_bullets,
  delete_paragraph_bullets,
  // document and section layout (curated batchUpdate requests)
  update_document_style,
  insert_section_break,
  update_section_style,
} satisfies Record<string, AnyOperation<docs_v1.Docs>>;
