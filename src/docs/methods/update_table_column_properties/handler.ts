import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { location } from '../../lib/address.js';
import { applyUpdate } from '../../lib/batch.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { tableColumnProperties } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateTableColumnProperties: forGoogle({
      tableStartLocation: location(args.tableStartLocation),
      columnIndices: args.columnIndices,
      // One source object feeds both mask and values: the spread carries
      // every entity field through, and only width is overridden (to the PT
      // Dimension). A future TableColumnProperties field flows into both
      // automatically; a mask key with no value would make Google RESET that
      // property, which is exactly the desync this shape makes
      // unrepresentable.
      tableColumnProperties: forGoogle({
        ...tableColumnProperties,
        width: pt(tableColumnProperties.width),
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(tableColumnProperties).join(','),
    }),
  });
  return { documentId, revisionId };
}
