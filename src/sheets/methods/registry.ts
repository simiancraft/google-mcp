import type { sheets_v4 } from '@googleapis/sheets';
import type { AnyOperation } from '../../lib/operation.js';
import { add_banding } from './add_banding/index.js';
import { add_chart } from './add_chart/index.js';
import { add_conditional_format_rule } from './add_conditional_format_rule/index.js';
import { add_dimension_group } from './add_dimension_group/index.js';
import { add_filter_view } from './add_filter_view/index.js';
import { add_named_range } from './add_named_range/index.js';
import { add_protected_range } from './add_protected_range/index.js';
import { add_sheet } from './add_sheet/index.js';
import { append_dimension } from './append_dimension/index.js';
import { append_values } from './append_values/index.js';
import { auto_fill } from './auto_fill/index.js';
import { auto_resize_dimensions } from './auto_resize_dimensions/index.js';
import { batch_clear_values } from './batch_clear_values/index.js';
import { batch_clear_values_by_data_filter } from './batch_clear_values_by_data_filter/index.js';
import { batch_get_values } from './batch_get_values/index.js';
import { batch_get_values_by_data_filter } from './batch_get_values_by_data_filter/index.js';
import { batch_update_values } from './batch_update_values/index.js';
import { batch_update_values_by_data_filter } from './batch_update_values_by_data_filter/index.js';
import { clear_basic_filter } from './clear_basic_filter/index.js';
import { clear_data_validation } from './clear_data_validation/index.js';
import { clear_values } from './clear_values/index.js';
import { copy_paste } from './copy_paste/index.js';
import { copy_sheet } from './copy_sheet/index.js';
import { create_spreadsheet } from './create_spreadsheet/index.js';
import { cut_paste } from './cut_paste/index.js';
import { delete_banding } from './delete_banding/index.js';
import { delete_conditional_format_rule } from './delete_conditional_format_rule/index.js';
import { delete_dimension } from './delete_dimension/index.js';
import { delete_dimension_group } from './delete_dimension_group/index.js';
import { delete_duplicates } from './delete_duplicates/index.js';
import { delete_embedded_object } from './delete_embedded_object/index.js';
import { delete_filter_view } from './delete_filter_view/index.js';
import { delete_named_range } from './delete_named_range/index.js';
import { delete_protected_range } from './delete_protected_range/index.js';
import { delete_range } from './delete_range/index.js';
import { delete_sheet } from './delete_sheet/index.js';
import { duplicate_filter_view } from './duplicate_filter_view/index.js';
import { duplicate_sheet } from './duplicate_sheet/index.js';
import { find_replace } from './find_replace/index.js';
import { get_developer_metadata } from './get_developer_metadata/index.js';
import { get_spreadsheet } from './get_spreadsheet/index.js';
import { get_values } from './get_values/index.js';
import { insert_dimension } from './insert_dimension/index.js';
import { insert_range } from './insert_range/index.js';
import { merge_cells } from './merge_cells/index.js';
import { move_conditional_format_rule } from './move_conditional_format_rule/index.js';
import { move_dimension } from './move_dimension/index.js';
import { randomize_range } from './randomize_range/index.js';
import { repeat_cell } from './repeat_cell/index.js';
import { search_developer_metadata } from './search_developer_metadata/index.js';
import { set_basic_filter } from './set_basic_filter/index.js';
import { set_data_validation } from './set_data_validation/index.js';
import { sort_range } from './sort_range/index.js';
import { text_to_columns } from './text_to_columns/index.js';
import { trim_whitespace } from './trim_whitespace/index.js';
import { unmerge_cells } from './unmerge_cells/index.js';
import { update_banding } from './update_banding/index.js';
import { update_borders } from './update_borders/index.js';
import { update_cells } from './update_cells/index.js';
import { update_chart_spec } from './update_chart_spec/index.js';
import { update_conditional_format_rule } from './update_conditional_format_rule/index.js';
import { update_dimension_group } from './update_dimension_group/index.js';
import { update_dimension_properties } from './update_dimension_properties/index.js';
import { update_embedded_object_border } from './update_embedded_object_border/index.js';
import { update_embedded_object_position } from './update_embedded_object_position/index.js';
import { update_filter_view } from './update_filter_view/index.js';
import { update_protected_range } from './update_protected_range/index.js';
import { update_sheet_properties } from './update_sheet_properties/index.js';
import { update_spreadsheet_properties } from './update_spreadsheet_properties/index.js';
import { update_values } from './update_values/index.js';

/**
 * REST-sourced operations, from
 * `developers.google.com/workspace/sheets/api/reference/rest`. Google
 * published no MCP toolset for Sheets when this service shipped (a developer
 * preview exists now; reconciling is issue #76), so there is no `tools/`
 * folder and this registry is the service's whole wire surface. Removals (the clears)
 * carry `destructiveHint`; see EXTENDING.md's annotation rubric.
 */
export const methods = {
  // spreadsheets
  get_spreadsheet,
  create_spreadsheet,
  update_spreadsheet_properties,
  // values
  get_values,
  update_values,
  append_values,
  clear_values,
  batch_get_values,
  batch_update_values,
  batch_clear_values,
  // values, selected by data filter
  batch_get_values_by_data_filter,
  batch_update_values_by_data_filter,
  batch_clear_values_by_data_filter,
  // developer metadata
  get_developer_metadata,
  search_developer_metadata,
  // sheets
  copy_sheet,
  add_sheet,
  delete_sheet,
  duplicate_sheet,
  update_sheet_properties,
  // layout and dimensions
  insert_dimension,
  delete_dimension,
  auto_resize_dimensions,
  update_dimension_properties,
  move_dimension,
  append_dimension,
  add_dimension_group,
  update_dimension_group,
  delete_dimension_group,
  // named ranges
  add_named_range,
  delete_named_range,
  // formatting
  repeat_cell,
  update_borders,
  // banding
  add_banding,
  update_banding,
  delete_banding,
  // cell content and merges
  update_cells,
  merge_cells,
  unmerge_cells,
  // sorting, filters, and data transformations
  sort_range,
  set_basic_filter,
  clear_basic_filter,
  add_filter_view,
  update_filter_view,
  duplicate_filter_view,
  delete_filter_view,
  find_replace,
  delete_duplicates,
  trim_whitespace,
  text_to_columns,
  auto_fill,
  copy_paste,
  cut_paste,
  insert_range,
  delete_range,
  randomize_range,
  // conditional format rules
  add_conditional_format_rule,
  update_conditional_format_rule,
  move_conditional_format_rule,
  delete_conditional_format_rule,
  // data validation
  set_data_validation,
  clear_data_validation,
  // protected ranges
  add_protected_range,
  update_protected_range,
  delete_protected_range,
  // charts
  add_chart,
  update_chart_spec,
  update_embedded_object_position,
  update_embedded_object_border,
  delete_embedded_object,
} satisfies Record<string, AnyOperation<sheets_v4.Sheets>>;
