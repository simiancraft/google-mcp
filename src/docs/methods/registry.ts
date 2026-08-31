import type { docs_v1 } from '@googleapis/docs';
import type { AnyOperation } from '../../lib/operation.js';
import { create_document } from './create_document/index.js';
import { create_footer } from './create_footer/index.js';
import { create_footnote } from './create_footnote/index.js';
import { create_header } from './create_header/index.js';
import { create_named_range } from './create_named_range/index.js';
import { create_paragraph_bullets } from './create_paragraph_bullets/index.js';
import { delete_content_range } from './delete_content_range/index.js';
import { delete_footer } from './delete_footer/index.js';
import { delete_header } from './delete_header/index.js';
import { delete_named_range } from './delete_named_range/index.js';
import { delete_paragraph_bullets } from './delete_paragraph_bullets/index.js';
import { delete_positioned_object } from './delete_positioned_object/index.js';
import { delete_table_column } from './delete_table_column/index.js';
import { delete_table_row } from './delete_table_row/index.js';
import { get_document } from './get_document/index.js';
import { insert_inline_image } from './insert_inline_image/index.js';
import { insert_page_break } from './insert_page_break/index.js';
import { insert_section_break } from './insert_section_break/index.js';
import { insert_table } from './insert_table/index.js';
import { insert_table_column } from './insert_table_column/index.js';
import { insert_table_row } from './insert_table_row/index.js';
import { insert_text } from './insert_text/index.js';
import { merge_table_cells } from './merge_table_cells/index.js';
import { pin_table_header_rows } from './pin_table_header_rows/index.js';
import { replace_all_text } from './replace_all_text/index.js';
import { replace_image } from './replace_image/index.js';
import { replace_named_range_content } from './replace_named_range_content/index.js';
import { unmerge_table_cells } from './unmerge_table_cells/index.js';
import { update_document_style } from './update_document_style/index.js';
import { update_paragraph_style } from './update_paragraph_style/index.js';
import { update_section_style } from './update_section_style/index.js';
import { update_table_cell_style } from './update_table_cell_style/index.js';
import { update_table_column_properties } from './update_table_column_properties/index.js';
import { update_table_row_style } from './update_table_row_style/index.js';
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
  // tables (curated batchUpdate requests)
  insert_table,
  insert_table_row,
  insert_table_column,
  delete_table_row,
  delete_table_column,
  update_table_row_style,
  update_table_column_properties,
  update_table_cell_style,
  merge_table_cells,
  unmerge_table_cells,
  pin_table_header_rows,
  // named ranges (curated batchUpdate requests)
  create_named_range,
  delete_named_range,
  replace_named_range_content,
  // headers and footers (curated batchUpdate requests)
  create_header,
  create_footer,
  delete_header,
  delete_footer,
  // page breaks, footnotes, and objects (curated batchUpdate requests)
  insert_page_break,
  create_footnote,
  insert_inline_image,
  replace_image,
  delete_positioned_object,
} satisfies Record<string, AnyOperation<docs_v1.Docs>>;
