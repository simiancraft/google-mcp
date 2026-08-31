import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { range } from '../../lib/address.js';
import { applyUpdate } from '../../lib/batch.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { sectionStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateSectionStyle: {
      range: range(args.range),
      // One source object feeds both mask and values: the spread carries
      // every entity field through, and only the point-valued fields (to PT
      // Dimensions, columnProperties nesting per column) are overridden, so
      // mask and values cannot desync.
      sectionStyle: forGoogle({
        ...sectionStyle,
        marginTop: pt(sectionStyle.marginTop),
        marginBottom: pt(sectionStyle.marginBottom),
        marginLeft: pt(sectionStyle.marginLeft),
        marginRight: pt(sectionStyle.marginRight),
        marginHeader: pt(sectionStyle.marginHeader),
        marginFooter: pt(sectionStyle.marginFooter),
        columnProperties: sectionStyle.columnProperties?.map((column) =>
          forGoogle({ width: pt(column.width), paddingEnd: pt(column.paddingEnd) }),
        ),
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(sectionStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
