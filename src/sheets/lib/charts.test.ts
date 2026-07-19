import { describe, expect, it } from 'bun:test';
import { toChartSpec, toEmbeddedObjectPosition } from './charts.js';

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
});
