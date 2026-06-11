import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { applyUpdate } from '../../lib/batch.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { textStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateTextStyle: {
      range: args.range,
      // One source object feeds both mask and values: the spread carries every
      // entity field through, and only fontSize is overridden (points to the
      // PT Dimension). A future TextStyle field flows into both automatically;
      // a mask key with no value would make Google RESET that property, which
      // is exactly the desync this shape makes unrepresentable.
      textStyle: forGoogle({
        ...textStyle,
        fontSize:
          textStyle.fontSize === undefined
            ? undefined
            : { magnitude: textStyle.fontSize, unit: 'PT' },
      }),
      // The key names are the REST JSON field names, which FieldMask accepts;
      // a compile pin in the test holds that naming.
      fields: Object.keys(textStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
