import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toChartSpec } from '../../lib/charts.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.spec.basicChart === undefined) === (args.spec.pieChart === undefined)) {
    throw new Error('Provide exactly one of spec.basicChart or spec.pieChart.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateChartSpec: { chartId: args.chartId, spec: toChartSpec(args.spec) },
  });
  return { spreadsheetId: args.spreadsheetId, chartId: args.chartId };
}
