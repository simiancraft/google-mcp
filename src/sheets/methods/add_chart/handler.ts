import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { assertOneChartType, toChartSpec, toEmbeddedObjectPosition } from '../../lib/charts.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  assertOneChartType(args.spec);
  if ((args.position.overlayPosition === undefined) === (args.position.newSheet === undefined)) {
    throw new Error('Provide exactly one of position.overlayPosition or position.newSheet: true.');
  }
  if (args.position.sheetId !== undefined) {
    throw new Error(
      'Do not provide position.sheetId when adding a chart; use overlayPosition or newSheet: true.',
    );
  }
  if (
    args.position.overlayPosition !== undefined &&
    args.position.overlayPosition.anchorCell === undefined
  ) {
    throw new Error('Provide position.overlayPosition.anchorCell when adding an overlay chart.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addChart: {
      chart: {
        spec: toChartSpec(args.spec),
        position: toEmbeddedObjectPosition(args.position),
      },
    },
  });
  const chart = reply.addChart?.chart;
  if (chart?.chartId == null) {
    throw new Error('Google accepted the chart but returned no chart ID in the reply.');
  }
  return {
    chartId: chart.chartId,
    sheetId: chart.position?.sheetId ?? undefined,
  };
}
