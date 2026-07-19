import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { ChartData } from '../entities/ChartData.js';
import type { ChartSpec } from '../entities/ChartSpec.js';
import type { EmbeddedObjectPosition } from '../entities/EmbeddedObjectPosition.js';

/**
 * Reject a ChartSpec that does not carry exactly one chart type. The entity
 * types basicChart and pieChart as independent optionals (a zod union would
 * complicate the recursive strict-input pin), so the exactly-one rule is
 * enforced here, once, for every chart operation.
 */
export function assertOneChartType(spec: ChartSpec): void {
  if ((spec.basicChart === undefined) === (spec.pieChart === undefined)) {
    throw new Error('Provide exactly one of spec.basicChart or spec.pieChart.');
  }
}

/** Carry a ChartData across the Google boundary; see optionality.ts. */
function toChartData(data: ChartData): sheets_v4.Schema$ChartData {
  return { sourceRange: { sources: data.sourceRange.sources.map((range) => forGoogle(range)) } };
}

/** Carry a ChartSpec across the Google boundary, `forGoogle` at each level. */
export function toChartSpec(spec: ChartSpec): sheets_v4.Schema$ChartSpec {
  return forGoogle({
    title: spec.title,
    subtitle: spec.subtitle,
    basicChart: spec.basicChart
      ? forGoogle({
          chartType: spec.basicChart.chartType,
          legendPosition: spec.basicChart.legendPosition,
          headerCount: spec.basicChart.headerCount,
          axis: spec.basicChart.axis
            ? spec.basicChart.axis.map((axis) => forGoogle(axis))
            : undefined,
          domains: spec.basicChart.domains
            ? spec.basicChart.domains.map((domain) => ({ domain: toChartData(domain.domain) }))
            : undefined,
          series: spec.basicChart.series.map((series) =>
            forGoogle({
              series: toChartData(series.series),
              targetAxis: series.targetAxis,
              type: series.type,
            }),
          ),
        })
      : undefined,
    pieChart: spec.pieChart
      ? forGoogle({
          legendPosition: spec.pieChart.legendPosition,
          domain: spec.pieChart.domain ? toChartData(spec.pieChart.domain) : undefined,
          series: spec.pieChart.series ? toChartData(spec.pieChart.series) : undefined,
          threeDimensional: spec.pieChart.threeDimensional,
          pieHole: spec.pieChart.pieHole,
        })
      : undefined,
  });
}

/** Carry an EmbeddedObjectPosition across the Google boundary. */
export function toEmbeddedObjectPosition(
  position: EmbeddedObjectPosition,
): sheets_v4.Schema$EmbeddedObjectPosition {
  return forGoogle({
    newSheet: position.newSheet,
    overlayPosition: position.overlayPosition
      ? forGoogle({
          anchorCell: forGoogle(position.overlayPosition.anchorCell),
          offsetXPixels: position.overlayPosition.offsetXPixels,
          offsetYPixels: position.overlayPosition.offsetYPixels,
          widthPixels: position.overlayPosition.widthPixels,
          heightPixels: position.overlayPosition.heightPixels,
        })
      : undefined,
  });
}
