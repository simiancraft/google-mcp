import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { assertOneChartType, toChartSpec } from '../../lib/charts.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  assertOneChartType(args.spec);
  await applyRequest(sheets, args.spreadsheetId, {
    updateChartSpec: { chartId: args.chartId, spec: toChartSpec(args.spec) },
  });
  return { spreadsheetId: args.spreadsheetId, chartId: args.chartId };
}
