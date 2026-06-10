import type { sheets_v4 } from '@googleapis/sheets';
import type { AnyOperation } from '../../lib/operation.js';
import { append_values } from './append_values/index.js';
import { batch_clear_values } from './batch_clear_values/index.js';
import { batch_clear_values_by_data_filter } from './batch_clear_values_by_data_filter/index.js';
import { batch_get_values } from './batch_get_values/index.js';
import { batch_get_values_by_data_filter } from './batch_get_values_by_data_filter/index.js';
import { batch_update_values } from './batch_update_values/index.js';
import { batch_update_values_by_data_filter } from './batch_update_values_by_data_filter/index.js';
import { clear_values } from './clear_values/index.js';
import { copy_sheet } from './copy_sheet/index.js';
import { create_spreadsheet } from './create_spreadsheet/index.js';
import { get_developer_metadata } from './get_developer_metadata/index.js';
import { get_spreadsheet } from './get_spreadsheet/index.js';
import { get_values } from './get_values/index.js';
import { search_developer_metadata } from './search_developer_metadata/index.js';
import { update_values } from './update_values/index.js';

/**
 * REST-sourced operations, from
 * `developers.google.com/workspace/sheets/api/reference/rest`. Google
 * publishes no MCP toolset for Sheets, so there is no `tools/` folder and
 * this registry is the service's whole wire surface. Irreversible ones (the
 * clears) carry `destructive`.
 */
export const methods = {
  // spreadsheets
  get_spreadsheet,
  create_spreadsheet,
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
} satisfies Record<string, AnyOperation<sheets_v4.Sheets>>;
