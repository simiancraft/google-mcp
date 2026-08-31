import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import type { TableCellBorder } from '../../entities/TableCellBorder.js';
import { location, tableRange } from '../../lib/address.js';
import { applyUpdate } from '../../lib/batch.js';
import { optionalColor } from '../../lib/color.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

/** Build the wire border: the width becomes a PT Dimension. */
function border(b: TableCellBorder | undefined): docs_v1.Schema$TableCellBorder | undefined {
  return b === undefined
    ? undefined
    : forGoogle({
        ...b,
        color: optionalColor(b.color),
        width: pt(b.width),
      });
}

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { tableCellStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateTableCellStyle: forGoogle({
      tableRange: tableRange(args.tableRange),
      tableStartLocation: location(args.tableStartLocation),
      // One source object feeds both mask and values: the spread carries
      // every entity field through, and only the color, border, and
      // point-valued fields are overridden (to their wire nesting). A future
      // TableCellStyle field flows into both automatically; a mask key with
      // no value would make Google RESET that property, which is exactly the
      // desync this shape makes unrepresentable.
      tableCellStyle: forGoogle({
        ...tableCellStyle,
        backgroundColor: optionalColor(tableCellStyle.backgroundColor),
        borderTop: border(tableCellStyle.borderTop),
        borderBottom: border(tableCellStyle.borderBottom),
        borderLeft: border(tableCellStyle.borderLeft),
        borderRight: border(tableCellStyle.borderRight),
        paddingTop: pt(tableCellStyle.paddingTop),
        paddingBottom: pt(tableCellStyle.paddingBottom),
        paddingLeft: pt(tableCellStyle.paddingLeft),
        paddingRight: pt(tableCellStyle.paddingRight),
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(tableCellStyle).join(','),
    }),
  });
  return { documentId, revisionId };
}
