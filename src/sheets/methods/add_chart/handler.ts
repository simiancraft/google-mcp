import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toChartSpec, toEmbeddedObjectPosition } from '../../lib/charts.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.spec.basicChart === undefined) === (args.spec.pieChart === undefined)) {
    throw new Error('Provide exactly one of spec.basicChart or spec.pieChart.');
  }
  if (args.position.overlayPosition === undefined && args.position.newSheet === undefined) {
    throw new Error('Provide a position: an overlayPosition, or newSheet: true.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addChart: {
      chart: {
        spec: toChartSpec(args.spec),
        position: toEmbeddedObjectPosition(args.position),
      },
    },
  });
  const chart = reply.addChart?.chart ?? {};
  return {
    chartId: chart.chartId ?? 0,
    sheetId: chart.position?.sheetId ?? undefined,
  };
}
