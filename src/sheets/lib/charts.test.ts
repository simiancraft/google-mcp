import { describe, expect, it } from 'bun:test';
import { projectEmbeddedObjectPosition, toChartSpec, toEmbeddedObjectPosition } from './charts.js';

describe('toChartSpec', () => {
  it('carries a basic chart with axes, domain, and series', () => {
    expect(
      toChartSpec({
        title: 'Revenue by month',
        basicChart: {
          chartType: 'COLUMN',
          legendPosition: 'BOTTOM_LEGEND',
          headerCount: 1,
          axis: [{ position: 'BOTTOM_AXIS', title: 'Month' }],
          domains: [
            {
              domain: {
                sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }] },
              },
            },
          ],
          series: [
            {
              series: {
                sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
              },
              targetAxis: 'LEFT_AXIS',
            },
          ],
        },
      }),
    ).toEqual({
      title: 'Revenue by month',
      basicChart: {
        chartType: 'COLUMN',
        legendPosition: 'BOTTOM_LEGEND',
        headerCount: 1,
        axis: [{ position: 'BOTTOM_AXIS', title: 'Month' }],
        domains: [
          {
            domain: {
              sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }] },
            },
          },
        ],
        series: [
          {
            series: {
              sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
            },
            targetAxis: 'LEFT_AXIS',
          },
        ],
      },
    });
  });

  it('carries a bare basic chart', () => {
    expect(
      toChartSpec({
        basicChart: {
          chartType: 'LINE',
          series: [{ series: { sourceRange: { sources: [{ sheetId: 1 }] } } }],
        },
      }),
    ).toEqual({
      basicChart: {
        chartType: 'LINE',
        series: [{ series: { sourceRange: { sources: [{ sheetId: 1 }] } } }],
      },
    });
  });

  it('carries a pie chart', () => {
    expect(
      toChartSpec({
        subtitle: 'FY26',
        pieChart: {
          legendPosition: 'LABELED_LEGEND',
          domain: {
            sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }] },
          },
          series: {
            sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
          },
          pieHole: 0.4,
        },
      }),
    ).toEqual({
      subtitle: 'FY26',
      pieChart: {
        legendPosition: 'LABELED_LEGEND',
        domain: {
          sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 0, endColumnIndex: 1 }] },
        },
        series: {
          sourceRange: { sources: [{ sheetId: 0, startColumnIndex: 1, endColumnIndex: 2 }] },
        },
        pieHole: 0.4,
      },
    });
  });

  it('carries a bare pie chart', () => {
    expect(toChartSpec({ pieChart: {} })).toEqual({ pieChart: {} });
  });

  it('carries common chart presentation fields', () => {
    expect(
      toChartSpec({
        title: 'Revenue',
        altText: 'Revenue by month',
        titleTextFormat: {
          foregroundColorStyle: { themeColor: 'TEXT' },
          fontFamily: 'Inter',
          fontSize: 16,
          bold: true,
          italic: false,
        },
        titleTextPosition: { horizontalAlignment: 'CENTER' },
        subtitle: 'FY26',
        subtitleTextFormat: { fontSize: 10 },
        subtitleTextPosition: { horizontalAlignment: 'RIGHT' },
        fontName: 'Inter',
        maximized: true,
        backgroundColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
        hiddenDimensionStrategy: 'SKIP_HIDDEN_ROWS',
        pieChart: {},
      }),
    ).toEqual({
      title: 'Revenue',
      altText: 'Revenue by month',
      titleTextFormat: {
        foregroundColorStyle: { themeColor: 'TEXT' },
        fontFamily: 'Inter',
        fontSize: 16,
        bold: true,
        italic: false,
      },
      titleTextPosition: { horizontalAlignment: 'CENTER' },
      subtitle: 'FY26',
      subtitleTextFormat: { fontSize: 10 },
      subtitleTextPosition: { horizontalAlignment: 'RIGHT' },
      fontName: 'Inter',
      maximized: true,
      backgroundColorStyle: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } },
      hiddenDimensionStrategy: 'SKIP_HIDDEN_ROWS',
      pieChart: {},
    });
  });

  it('carries every histogram option', () => {
    expect(
      toChartSpec({
        histogramChart: {
          series: [
            {
              barColorStyle: { themeColor: 'ACCENT1' },
              data: {
                sourceRange: {
                  sources: [{ sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 }],
                },
              },
            },
          ],
          legendPosition: 'INSIDE_LEGEND',
          showItemDividers: true,
          bucketSize: 5,
          outlierPercentile: 0.05,
        },
      }),
    ).toEqual({
      histogramChart: {
        series: [
          {
            barColorStyle: { themeColor: 'ACCENT1' },
            data: {
              sourceRange: {
                sources: [{ sheetId: 1, startColumnIndex: 0, endColumnIndex: 1 }],
              },
            },
          },
        ],
        legendPosition: 'INSIDE_LEGEND',
        showItemDividers: true,
        bucketSize: 5,
        outlierPercentile: 0.05,
      },
    });
  });

  it('carries the candlestick domain and all four series', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        candlestickChart: {
          domain: { data: data(0), reversed: true },
          data: [
            {
              lowSeries: { data: data(1) },
              openSeries: { data: data(2) },
              closeSeries: { data: data(3) },
              highSeries: { data: data(4) },
            },
          ],
        },
      }),
    ).toEqual({
      candlestickChart: {
        domain: { data: data(0), reversed: true },
        data: [
          {
            lowSeries: { data: data(1) },
            openSeries: { data: data(2) },
            closeSeries: { data: data(3) },
            highSeries: { data: data(4) },
          },
        ],
      },
    });
  });

  it('carries every bubble option and enforces the bubble-size dependency', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        bubbleChart: {
          legendPosition: 'RIGHT_LEGEND',
          bubbleLabels: data(0),
          domain: data(1),
          series: data(2),
          groupIds: data(3),
          bubbleSizes: data(4),
          bubbleOpacity: 0.7,
          bubbleBorderColorStyle: { themeColor: 'ACCENT2' },
          bubbleMaxRadiusSize: 30,
          bubbleMinRadiusSize: 5,
          bubbleTextStyle: { bold: true },
        },
      }),
    ).toEqual({
      bubbleChart: {
        legendPosition: 'RIGHT_LEGEND',
        bubbleLabels: data(0),
        domain: data(1),
        series: data(2),
        groupIds: data(3),
        bubbleSizes: data(4),
        bubbleOpacity: 0.7,
        bubbleBorderColorStyle: { themeColor: 'ACCENT2' },
        bubbleMaxRadiusSize: 30,
        bubbleMinRadiusSize: 5,
        bubbleTextStyle: { bold: true },
      },
    });
    expect(() =>
      toChartSpec({
        bubbleChart: { domain: data(1), series: data(2), bubbleSizes: data(4) },
      }),
    ).toThrow('Provide bubbleChart.groupIds');
  });

  it('carries every org-chart option', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        orgChart: {
          nodeSize: 'LARGE',
          nodeColorStyle: { themeColor: 'ACCENT1' },
          selectedNodeColorStyle: { themeColor: 'ACCENT2' },
          labels: data(0),
          parentLabels: data(1),
          tooltips: data(2),
        },
      }),
    ).toEqual({
      orgChart: {
        nodeSize: 'LARGE',
        nodeColorStyle: { themeColor: 'ACCENT1' },
        selectedNodeColorStyle: { themeColor: 'ACCENT2' },
        labels: data(0),
        parentLabels: data(1),
        tooltips: data(2),
      },
    });
  });

  it('carries every scorecard option', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        scorecardChart: {
          keyValueData: data(0),
          baselineValueData: data(1),
          aggregateType: 'SUM',
          keyValueFormat: {
            textFormat: { bold: true },
            position: { horizontalAlignment: 'CENTER' },
          },
          baselineValueFormat: {
            comparisonType: 'PERCENTAGE_DIFFERENCE',
            textFormat: { italic: true },
            position: { horizontalAlignment: 'RIGHT' },
            description: 'vs target',
            positiveColorStyle: { themeColor: 'ACCENT1' },
            negativeColorStyle: { themeColor: 'ACCENT2' },
          },
          scaleFactor: 1000,
          numberFormatSource: 'CUSTOM',
          customFormatOptions: { prefix: '$', suffix: 'k' },
        },
      }),
    ).toEqual({
      scorecardChart: {
        keyValueData: data(0),
        baselineValueData: data(1),
        aggregateType: 'SUM',
        keyValueFormat: {
          textFormat: { bold: true },
          position: { horizontalAlignment: 'CENTER' },
        },
        baselineValueFormat: {
          comparisonType: 'PERCENTAGE_DIFFERENCE',
          textFormat: { italic: true },
          position: { horizontalAlignment: 'RIGHT' },
          description: 'vs target',
          positiveColorStyle: { themeColor: 'ACCENT1' },
          negativeColorStyle: { themeColor: 'ACCENT2' },
        },
        scaleFactor: 1000,
        numberFormatSource: 'CUSTOM',
        customFormatOptions: { prefix: '$', suffix: 'k' },
      },
    });
  });

  it('carries every treemap option', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        treemapChart: {
          labels: data(0),
          parentLabels: data(1),
          sizeData: data(2),
          colorData: data(3),
          textFormat: { bold: true },
          levels: 3,
          hintedLevels: 1,
          minValue: -10,
          maxValue: 50,
          headerColorStyle: { themeColor: 'ACCENT1' },
          colorScale: {
            minValueColorStyle: { themeColor: 'ACCENT2' },
            midValueColorStyle: { themeColor: 'ACCENT3' },
            maxValueColorStyle: { themeColor: 'ACCENT4' },
            noDataColorStyle: { themeColor: 'BACKGROUND' },
          },
          hideTooltips: true,
        },
      }),
    ).toEqual({
      treemapChart: {
        labels: data(0),
        parentLabels: data(1),
        sizeData: data(2),
        colorData: data(3),
        textFormat: { bold: true },
        levels: 3,
        hintedLevels: 1,
        minValue: -10,
        maxValue: 50,
        headerColorStyle: { themeColor: 'ACCENT1' },
        colorScale: {
          minValueColorStyle: { themeColor: 'ACCENT2' },
          midValueColorStyle: { themeColor: 'ACCENT3' },
          maxValueColorStyle: { themeColor: 'ACCENT4' },
          noDataColorStyle: { themeColor: 'BACKGROUND' },
        },
        hideTooltips: true,
      },
    });
  });

  it('carries waterfall data, styles, options, and custom subtotals', () => {
    const data = (column: number) => ({
      sourceRange: {
        sources: [{ sheetId: 1, startColumnIndex: column, endColumnIndex: column + 1 }],
      },
    });
    expect(
      toChartSpec({
        waterfallChart: {
          domain: { data: data(0), reversed: true },
          series: [
            {
              data: data(1),
              positiveColumnsStyle: {
                colorStyle: { themeColor: 'ACCENT1' },
                label: 'Gain',
              },
              negativeColumnsStyle: {
                colorStyle: { themeColor: 'ACCENT2' },
                label: 'Loss',
              },
              subtotalColumnsStyle: {
                colorStyle: { themeColor: 'ACCENT3' },
                label: 'Subtotal',
              },
              hideTrailingSubtotal: true,
              customSubtotals: [{ subtotalIndex: 2, label: 'Q1', dataIsSubtotal: false }],
            },
          ],
          stackedType: 'SEQUENTIAL',
          firstValueIsTotal: true,
          hideConnectorLines: false,
        },
      }),
    ).toEqual({
      waterfallChart: {
        domain: { data: data(0), reversed: true },
        series: [
          {
            data: data(1),
            positiveColumnsStyle: {
              colorStyle: { themeColor: 'ACCENT1' },
              label: 'Gain',
            },
            negativeColumnsStyle: {
              colorStyle: { themeColor: 'ACCENT2' },
              label: 'Loss',
            },
            subtotalColumnsStyle: {
              colorStyle: { themeColor: 'ACCENT3' },
              label: 'Subtotal',
            },
            hideTrailingSubtotal: true,
            customSubtotals: [{ subtotalIndex: 2, label: 'Q1', dataIsSubtotal: false }],
          },
        ],
        stackedType: 'SEQUENTIAL',
        firstValueIsTotal: true,
        hideConnectorLines: false,
      },
    });
  });
});

describe('toEmbeddedObjectPosition', () => {
  it('carries an overlay position', () => {
    expect(
      toEmbeddedObjectPosition({
        overlayPosition: {
          anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 },
          widthPixels: 600,
          heightPixels: 371,
        },
      }),
    ).toEqual({
      overlayPosition: {
        anchorCell: { sheetId: 2, rowIndex: 0, columnIndex: 4 },
        widthPixels: 600,
        heightPixels: 371,
      },
    });
  });

  it('carries a new-sheet position', () => {
    expect(toEmbeddedObjectPosition({ newSheet: true })).toEqual({ newSheet: true });
  });

  it('carries an explicit sheet id and a partial overlay', () => {
    expect(toEmbeddedObjectPosition({ sheetId: 8 })).toEqual({ sheetId: 8 });
    expect(toEmbeddedObjectPosition({ overlayPosition: { widthPixels: 500 } })).toEqual({
      overlayPosition: { widthPixels: 500 },
    });
  });
});

describe('projectEmbeddedObjectPosition', () => {
  it('projects write-only newSheet only when true and tolerates a bare overlay', () => {
    expect(
      projectEmbeddedObjectPosition({ sheetId: 12, newSheet: true, overlayPosition: {} }),
    ).toEqual({
      sheetId: 12,
      newSheet: true,
      overlayPosition: {},
    });
    expect(projectEmbeddedObjectPosition({ newSheet: false })).toEqual({});
  });
});
