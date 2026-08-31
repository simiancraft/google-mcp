import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { tableRowStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateTableRowStyle: forGoogle({
      tableStartLocation: args.tableStartLocation,
      rowIndices: args.rowIndices,
      // One source object feeds both mask and values: the spread carries
      // every entity field through, and only minRowHeight is overridden (to
      // the PT Dimension). A future TableRowStyle field flows into both
      // automatically; a mask key with no value would make Google RESET that
      // property, which is exactly the desync this shape makes
      // unrepresentable.
      tableRowStyle: forGoogle({
        ...tableRowStyle,
        minRowHeight: pt(tableRowStyle.minRowHeight),
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(tableRowStyle).join(','),
    }),
  });
  return { documentId, revisionId };
}
