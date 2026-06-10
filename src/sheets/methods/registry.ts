import type { sheets_v4 } from '@googleapis/sheets';
import type { AnyOperation } from '../../lib/operation.js';
import { batch_get_values } from './batch_get_values/index.js';
import { get_spreadsheet } from './get_spreadsheet/index.js';
import { get_values } from './get_values/index.js';

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
  // values
  get_values,
  batch_get_values,
} satisfies Record<string, AnyOperation<sheets_v4.Sheets>>;
