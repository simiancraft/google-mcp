import type { sheets_v4 } from '@googleapis/sheets';
import { forGoogle } from '../../lib/optionality.js';
import type { BubbleChartSpec } from '../entities/BubbleChartSpec.js';
import type { CandlestickChartSpec } from '../entities/CandlestickChartSpec.js';
import type { ChartData } from '../entities/ChartData.js';
import type { ChartSpec } from '../entities/ChartSpec.js';
import type { EmbeddedObjectBorder } from '../entities/EmbeddedObjectBorder.js';
import type { EmbeddedObjectPosition } from '../entities/EmbeddedObjectPosition.js';
import type { HistogramChartSpec } from '../entities/HistogramChartSpec.js';
import type { OrgChartSpec } from '../entities/OrgChartSpec.js';
import type { ScorecardChartSpec } from '../entities/ScorecardChartSpec.js';
import type { TextPosition } from '../entities/TextPosition.js';
import type { TreemapChartSpec } from '../entities/TreemapChartSpec.js';
import type { WaterfallChartSpec } from '../entities/WaterfallChartSpec.js';
import { toColorStyle, toTextFormat } from './formats.js';

/**
 * Reject a ChartSpec that does not carry exactly one chart type. The entity
 * types the family fields as independent optionals (a zod union would
 * complicate the recursive strict-input pin), so the exactly-one rule is
 * enforced here, once, for every chart operation.
 */
export function assertOneChartType(spec: ChartSpec): void {
  const chartTypes = [
    'basicChart',
    'pieChart',
    'bubbleChart',
    'candlestickChart',
    'orgChart',
    'histogramChart',
    'waterfallChart',
    'treemapChart',
    'scorecardChart',
  ] as const;
  if (chartTypes.filter((chartType) => spec[chartType] !== undefined).length !== 1) {
    throw new Error(
      `Provide exactly one of ${chartTypes.map((chartType) => `spec.${chartType}`).join(', ')}.`,
    );
  }
}

/** Carry a ChartData across the Google boundary; see optionality.ts. */
function toChartData(data: ChartData): sheets_v4.Schema$ChartData {
  return { sourceRange: { sources: data.sourceRange.sources.map((range) => forGoogle(range)) } };
}

function toTextPosition(position: TextPosition): sheets_v4.Schema$TextPosition {
  return forGoogle({ horizontalAlignment: position.horizontalAlignment });
}

function toHistogramChartSpec(spec: HistogramChartSpec): sheets_v4.Schema$HistogramChartSpec {
  return forGoogle({
    series: spec.series.map((series) =>
      forGoogle({
        barColorStyle: series.barColorStyle ? toColorStyle(series.barColorStyle) : undefined,
        data: toChartData(series.data),
      }),
    ),
    legendPosition: spec.legendPosition,
    showItemDividers: spec.showItemDividers,
    bucketSize: spec.bucketSize,
    outlierPercentile: spec.outlierPercentile,
  });
}

function toCandlestickChartSpec(spec: CandlestickChartSpec): sheets_v4.Schema$CandlestickChartSpec {
  return {
    domain: forGoogle({ data: toChartData(spec.domain.data), reversed: spec.domain.reversed }),
    data: spec.data.map((data) => ({
      lowSeries: { data: toChartData(data.lowSeries.data) },
      openSeries: { data: toChartData(data.openSeries.data) },
      closeSeries: { data: toChartData(data.closeSeries.data) },
      highSeries: { data: toChartData(data.highSeries.data) },
    })),
  };
}

function toBubbleChartSpec(spec: BubbleChartSpec): sheets_v4.Schema$BubbleChartSpec {
  if (spec.bubbleSizes !== undefined && spec.groupIds === undefined) {
    throw new Error('Provide bubbleChart.groupIds when bubbleChart.bubbleSizes is provided.');
  }
  return forGoogle({
    legendPosition: spec.legendPosition,
    bubbleLabels: spec.bubbleLabels ? toChartData(spec.bubbleLabels) : undefined,
    domain: toChartData(spec.domain),
    series: toChartData(spec.series),
    groupIds: spec.groupIds ? toChartData(spec.groupIds) : undefined,
    bubbleSizes: spec.bubbleSizes ? toChartData(spec.bubbleSizes) : undefined,
    bubbleOpacity: spec.bubbleOpacity,
    bubbleBorderColorStyle: spec.bubbleBorderColorStyle
      ? toColorStyle(spec.bubbleBorderColorStyle)
      : undefined,
    bubbleMaxRadiusSize: spec.bubbleMaxRadiusSize,
    bubbleMinRadiusSize: spec.bubbleMinRadiusSize,
    bubbleTextStyle: spec.bubbleTextStyle ? toTextFormat(spec.bubbleTextStyle) : undefined,
  });
}

function toOrgChartSpec(spec: OrgChartSpec): sheets_v4.Schema$OrgChartSpec {
  return forGoogle({
    nodeSize: spec.nodeSize,
    nodeColorStyle: spec.nodeColorStyle ? toColorStyle(spec.nodeColorStyle) : undefined,
    selectedNodeColorStyle: spec.selectedNodeColorStyle
      ? toColorStyle(spec.selectedNodeColorStyle)
      : undefined,
    labels: toChartData(spec.labels),
    parentLabels: spec.parentLabels ? toChartData(spec.parentLabels) : undefined,
    tooltips: spec.tooltips ? toChartData(spec.tooltips) : undefined,
  });
}

function toScorecardChartSpec(spec: ScorecardChartSpec): sheets_v4.Schema$ScorecardChartSpec {
  return forGoogle({
    keyValueData: toChartData(spec.keyValueData),
    baselineValueData: spec.baselineValueData ? toChartData(spec.baselineValueData) : undefined,
    aggregateType: spec.aggregateType,
    keyValueFormat: spec.keyValueFormat
      ? forGoogle({
          textFormat: spec.keyValueFormat.textFormat
            ? toTextFormat(spec.keyValueFormat.textFormat)
            : undefined,
          position: spec.keyValueFormat.position
            ? toTextPosition(spec.keyValueFormat.position)
            : undefined,
        })
      : undefined,
    baselineValueFormat: spec.baselineValueFormat
      ? forGoogle({
          comparisonType: spec.baselineValueFormat.comparisonType,
          textFormat: spec.baselineValueFormat.textFormat
            ? toTextFormat(spec.baselineValueFormat.textFormat)
            : undefined,
          position: spec.baselineValueFormat.position
            ? toTextPosition(spec.baselineValueFormat.position)
            : undefined,
          description: spec.baselineValueFormat.description,
          positiveColorStyle: spec.baselineValueFormat.positiveColorStyle
            ? toColorStyle(spec.baselineValueFormat.positiveColorStyle)
            : undefined,
          negativeColorStyle: spec.baselineValueFormat.negativeColorStyle
            ? toColorStyle(spec.baselineValueFormat.negativeColorStyle)
            : undefined,
        })
      : undefined,
    scaleFactor: spec.scaleFactor,
    numberFormatSource: spec.numberFormatSource,
    customFormatOptions: spec.customFormatOptions
      ? forGoogle({
          prefix: spec.customFormatOptions.prefix,
          suffix: spec.customFormatOptions.suffix,
        })
      : undefined,
  });
}

function toTreemapChartSpec(spec: TreemapChartSpec): sheets_v4.Schema$TreemapChartSpec {
  return forGoogle({
    labels: toChartData(spec.labels),
    parentLabels: toChartData(spec.parentLabels),
    sizeData: toChartData(spec.sizeData),
    colorData: spec.colorData ? toChartData(spec.colorData) : undefined,
    textFormat: spec.textFormat ? toTextFormat(spec.textFormat) : undefined,
    levels: spec.levels,
    hintedLevels: spec.hintedLevels,
    minValue: spec.minValue,
    maxValue: spec.maxValue,
    headerColorStyle: spec.headerColorStyle ? toColorStyle(spec.headerColorStyle) : undefined,
    colorScale: spec.colorScale
      ? forGoogle({
          minValueColorStyle: spec.colorScale.minValueColorStyle
            ? toColorStyle(spec.colorScale.minValueColorStyle)
            : undefined,
          midValueColorStyle: spec.colorScale.midValueColorStyle
            ? toColorStyle(spec.colorScale.midValueColorStyle)
            : undefined,
          maxValueColorStyle: spec.colorScale.maxValueColorStyle
            ? toColorStyle(spec.colorScale.maxValueColorStyle)
            : undefined,
          noDataColorStyle: spec.colorScale.noDataColorStyle
            ? toColorStyle(spec.colorScale.noDataColorStyle)
            : undefined,
        })
      : undefined,
    hideTooltips: spec.hideTooltips,
  });
}

function toWaterfallChartSpec(spec: WaterfallChartSpec): sheets_v4.Schema$WaterfallChartSpec {
  const toColumnStyle = (
    style: NonNullable<WaterfallChartSpec['series'][number]['positiveColumnsStyle']>,
  ): sheets_v4.Schema$WaterfallChartColumnStyle =>
    forGoogle({
      colorStyle: style.colorStyle ? toColorStyle(style.colorStyle) : undefined,
      label: style.label,
    });
  return forGoogle({
    domain: forGoogle({ data: toChartData(spec.domain.data), reversed: spec.domain.reversed }),
    series: spec.series.map((series) =>
      forGoogle({
        data: toChartData(series.data),
        positiveColumnsStyle: series.positiveColumnsStyle
          ? toColumnStyle(series.positiveColumnsStyle)
          : undefined,
        negativeColumnsStyle: series.negativeColumnsStyle
          ? toColumnStyle(series.negativeColumnsStyle)
          : undefined,
        subtotalColumnsStyle: series.subtotalColumnsStyle
          ? toColumnStyle(series.subtotalColumnsStyle)
          : undefined,
        hideTrailingSubtotal: series.hideTrailingSubtotal,
        customSubtotals: series.customSubtotals
          ? series.customSubtotals.map((subtotal) =>
              forGoogle({
                subtotalIndex: subtotal.subtotalIndex,
                label: subtotal.label,
                dataIsSubtotal: subtotal.dataIsSubtotal,
              }),
            )
          : undefined,
      }),
    ),
    stackedType: spec.stackedType,
    firstValueIsTotal: spec.firstValueIsTotal,
    hideConnectorLines: spec.hideConnectorLines,
  });
}

/** Carry a ChartSpec across the Google boundary, `forGoogle` at each level. */
export function toChartSpec(spec: ChartSpec): sheets_v4.Schema$ChartSpec {
  assertOneChartType(spec);
  return forGoogle({
    title: spec.title,
    altText: spec.altText,
    titleTextFormat: spec.titleTextFormat ? toTextFormat(spec.titleTextFormat) : undefined,
    titleTextPosition: spec.titleTextPosition ? toTextPosition(spec.titleTextPosition) : undefined,
    subtitle: spec.subtitle,
    subtitleTextFormat: spec.subtitleTextFormat ? toTextFormat(spec.subtitleTextFormat) : undefined,
    subtitleTextPosition: spec.subtitleTextPosition
      ? toTextPosition(spec.subtitleTextPosition)
      : undefined,
    fontName: spec.fontName,
    maximized: spec.maximized,
    backgroundColorStyle: spec.backgroundColorStyle
      ? toColorStyle(spec.backgroundColorStyle)
      : undefined,
    hiddenDimensionStrategy: spec.hiddenDimensionStrategy,
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
    bubbleChart: spec.bubbleChart ? toBubbleChartSpec(spec.bubbleChart) : undefined,
    candlestickChart: spec.candlestickChart
      ? toCandlestickChartSpec(spec.candlestickChart)
      : undefined,
    orgChart: spec.orgChart ? toOrgChartSpec(spec.orgChart) : undefined,
    histogramChart: spec.histogramChart ? toHistogramChartSpec(spec.histogramChart) : undefined,
    waterfallChart: spec.waterfallChart ? toWaterfallChartSpec(spec.waterfallChart) : undefined,
    treemapChart: spec.treemapChart ? toTreemapChartSpec(spec.treemapChart) : undefined,
    scorecardChart: spec.scorecardChart ? toScorecardChartSpec(spec.scorecardChart) : undefined,
  });
}

/** Carry an EmbeddedObjectPosition across the Google boundary. */
export function toEmbeddedObjectPosition(
  position: EmbeddedObjectPosition,
): sheets_v4.Schema$EmbeddedObjectPosition {
  return forGoogle({
    sheetId: position.sheetId,
    newSheet: position.newSheet,
    overlayPosition: position.overlayPosition
      ? forGoogle({
          anchorCell: position.overlayPosition.anchorCell
            ? forGoogle(position.overlayPosition.anchorCell)
            : undefined,
          offsetXPixels: position.overlayPosition.offsetXPixels,
          offsetYPixels: position.overlayPosition.offsetYPixels,
          widthPixels: position.overlayPosition.widthPixels,
          heightPixels: position.overlayPosition.heightPixels,
        })
      : undefined,
  });
}

/** Project a REST EmbeddedObjectPosition, cleaning nulls to undefined. */
export function projectEmbeddedObjectPosition(
  position: sheets_v4.Schema$EmbeddedObjectPosition,
): EmbeddedObjectPosition {
  return {
    sheetId: position.sheetId ?? undefined,
    newSheet: position.newSheet === true ? true : undefined,
    overlayPosition: position.overlayPosition
      ? {
          anchorCell: position.overlayPosition.anchorCell
            ? {
                // Required coordinate scalars can be omitted when zero in proto3 replies.
                sheetId: position.overlayPosition.anchorCell.sheetId ?? 0,
                rowIndex: position.overlayPosition.anchorCell.rowIndex ?? 0,
                columnIndex: position.overlayPosition.anchorCell.columnIndex ?? 0,
              }
            : undefined,
          offsetXPixels: position.overlayPosition.offsetXPixels ?? undefined,
          offsetYPixels: position.overlayPosition.offsetYPixels ?? undefined,
          widthPixels: position.overlayPosition.widthPixels ?? undefined,
          heightPixels: position.overlayPosition.heightPixels ?? undefined,
        }
      : undefined,
  };
}

/** Carry an EmbeddedObjectBorder across the Google boundary. */
export function toEmbeddedObjectBorder(
  border: EmbeddedObjectBorder,
): sheets_v4.Schema$EmbeddedObjectBorder {
  return forGoogle({
    colorStyle: border.colorStyle ? toColorStyle(border.colorStyle) : undefined,
  });
}
