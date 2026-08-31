import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import { optionalColor } from '../../lib/color.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { documentStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateDocumentStyle: {
      // One source object feeds both mask and values: the spread carries
      // every entity field through, and only the point-valued fields (to PT
      // Dimensions, pageSize nesting two) are overridden, so mask and values
      // cannot desync.
      documentStyle: forGoogle({
        ...documentStyle,
        marginTop: pt(documentStyle.marginTop),
        marginBottom: pt(documentStyle.marginBottom),
        marginLeft: pt(documentStyle.marginLeft),
        marginRight: pt(documentStyle.marginRight),
        marginHeader: pt(documentStyle.marginHeader),
        marginFooter: pt(documentStyle.marginFooter),
        pageSize:
          documentStyle.pageSize === undefined
            ? undefined
            : {
                height: pt(documentStyle.pageSize.height),
                width: pt(documentStyle.pageSize.width),
              },
        background:
          documentStyle.background === undefined
            ? undefined
            : { color: optionalColor(documentStyle.background.color) },
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(documentStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
