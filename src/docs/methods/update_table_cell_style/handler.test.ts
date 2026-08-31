import { describe, expect, it } from 'bun:test';
import type { docs_v1 } from '@googleapis/docs';
import { TableCellStyle } from '../../entities/TableCellStyle.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: docs_v1.Params$Resource$Documents$Batchupdate };

function fakeDocs(
  captured: Captured,
  data: docs_v1.Schema$BatchUpdateDocumentResponse,
): docs_v1.Docs {
  return {
    documents: {
      batchUpdate: async (params: docs_v1.Params$Resource$Documents$Batchupdate) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as docs_v1.Docs;
}

describe('update_table_cell_style', () => {
  it('entity keys are REST field names (the mask is built from them)', () => {
    const keys = Object.keys(TableCellStyle.shape);
    // Compile pin: the cast chain fails to compile if an entity key is not a
    // Schema$TableCellStyle field name (a rename would silently 400 live).
    const restKeys: (keyof docs_v1.Schema$TableCellStyle)[] =
      keys as (keyof typeof TableCellStyle.shape)[];
    expect(restKeys).toEqual(keys as (keyof typeof TableCellStyle.shape)[]);
  });

  it('styles a table range, building colors, borders, and PT dimensions', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeDocs(captured, { documentId: 'D1', writeControl: { requiredRevisionId: 'rev-6' } }),
      {
        documentId: 'D1',
        tableRange: {
          tableCellLocation: { tableStartLocation: { index: 5 }, rowIndex: 0, columnIndex: 0 },
          rowSpan: 1,
          columnSpan: 2,
        },
        tableCellStyle: {
          backgroundColor: { color: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } } },
          borderTop: { color: { color: { rgbColor: { red: 0 } } }, width: 1.5, dashStyle: 'DASH' },
          paddingLeft: 6,
          contentAlignment: 'MIDDLE',
        },
      },
    );
    expect(captured.params).toEqual({
      documentId: 'D1',
      requestBody: {
        requests: [
          {
            updateTableCellStyle: {
              tableRange: {
                tableCellLocation: {
                  tableStartLocation: { index: 5 },
                  rowIndex: 0,
                  columnIndex: 0,
                },
                rowSpan: 1,
                columnSpan: 2,
              },
              tableCellStyle: {
                backgroundColor: { color: { rgbColor: { red: 1, green: 0.9, blue: 0.8 } } },
                borderTop: {
                  color: { color: { rgbColor: { red: 0 } } },
                  width: { magnitude: 1.5, unit: 'PT' },
                  dashStyle: 'DASH',
                },
                paddingLeft: { magnitude: 6, unit: 'PT' },
                contentAlignment: 'MIDDLE',
              },
              fields: 'backgroundColor,borderTop,paddingLeft,contentAlignment',
            },
          },
        ],
      },
    });
    expect(result).toEqual({ documentId: 'D1', revisionId: 'rev-6' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('styles the whole table via the table start location', async () => {
    const captured: Captured = {};
    await handler(fakeDocs(captured, {}), {
      documentId: 'D2',
      tableStartLocation: { index: 11 },
      tableCellStyle: { contentAlignment: 'TOP' },
    });
    expect(captured.params?.requestBody?.requests?.[0]?.updateTableCellStyle).toEqual({
      tableStartLocation: { index: 11 },
      tableCellStyle: { contentAlignment: 'TOP' },
      fields: 'contentAlignment',
    });
  });

  it('rejects both targets, no target, and an empty style at the schema', () => {
    const style = { contentAlignment: 'TOP' } as const;
    const range = {
      tableCellLocation: { tableStartLocation: { index: 5 }, rowIndex: 0, columnIndex: 0 },
      rowSpan: 1,
      columnSpan: 1,
    };
    expect(
      schema.input.safeParse({
        documentId: 'D3',
        tableRange: range,
        tableStartLocation: { index: 5 },
        tableCellStyle: style,
      }).success,
    ).toBe(false);
    expect(schema.input.safeParse({ documentId: 'D3', tableCellStyle: style }).success).toBe(false);
    expect(
      schema.input.safeParse({
        documentId: 'D3',
        tableStartLocation: { index: 5 },
        tableCellStyle: {},
      }).success,
    ).toBe(false);
  });

  it('rejects an empty border object at the schema (an empty mask value would reset the border)', () => {
    expect(
      schema.input.safeParse({
        documentId: 'D3',
        tableStartLocation: { index: 5 },
        tableCellStyle: { borderTop: {} },
      }).success,
    ).toBe(false);
  });
});
