import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { range } from '../../lib/address.js';
import { applyUpdate } from '../../lib/batch.js';
import { optionalColor } from '../../lib/color.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { textStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateTextStyle: {
      range: range(args.range),
      // One source object feeds both mask and values: the spread carries every
      // entity field through, and only the fields whose wire shape differs are
      // overridden (fontSize to the PT Dimension; the colors and font family
      // through the boundary adapters). A future TextStyle field flows into
      // both automatically; a mask key with no value would make Google RESET
      // that property, which is exactly the desync this shape makes
      // unrepresentable.
      textStyle: forGoogle({
        ...textStyle,
        fontSize:
          textStyle.fontSize === undefined
            ? undefined
            : { magnitude: textStyle.fontSize, unit: 'PT' },
        foregroundColor: optionalColor(textStyle.foregroundColor),
        backgroundColor: optionalColor(textStyle.backgroundColor),
        weightedFontFamily:
          textStyle.weightedFontFamily === undefined
            ? undefined
            : forGoogle(textStyle.weightedFontFamily),
      }),
      // The key names are the REST JSON field names, which FieldMask accepts;
      // a compile pin in the test holds that naming.
      fields: Object.keys(textStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
