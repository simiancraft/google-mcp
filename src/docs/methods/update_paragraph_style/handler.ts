import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import type { ParagraphBorder } from '../../entities/ParagraphBorder.js';
import { range } from '../../lib/address.js';
import { applyUpdate } from '../../lib/batch.js';
import { optionalColor } from '../../lib/color.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

/** Build the wire border: widths and paddings become PT Dimensions. */
function border(b: ParagraphBorder | undefined): docs_v1.Schema$ParagraphBorder | undefined {
  return b === undefined
    ? undefined
    : forGoogle({
        ...b,
        color: optionalColor(b.color),
        width: pt(b.width),
        padding: pt(b.padding),
      });
}

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { paragraphStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateParagraphStyle: {
      range: range(args.range),
      // One source object feeds both mask and values: the spread carries every
      // entity field through, and only the point-valued fields (to PT
      // Dimensions) and borders (whose width and padding nest the same
      // conversion) are overridden. A future ParagraphStyle field flows into
      // both automatically; a mask key with no value would make Google RESET
      // that property, which is exactly the desync this shape makes
      // unrepresentable.
      paragraphStyle: forGoogle({
        ...paragraphStyle,
        spaceAbove: pt(paragraphStyle.spaceAbove),
        spaceBelow: pt(paragraphStyle.spaceBelow),
        indentFirstLine: pt(paragraphStyle.indentFirstLine),
        indentStart: pt(paragraphStyle.indentStart),
        indentEnd: pt(paragraphStyle.indentEnd),
        borderBetween: border(paragraphStyle.borderBetween),
        borderTop: border(paragraphStyle.borderTop),
        borderBottom: border(paragraphStyle.borderBottom),
        borderLeft: border(paragraphStyle.borderLeft),
        borderRight: border(paragraphStyle.borderRight),
        shading:
          paragraphStyle.shading === undefined
            ? undefined
            : forGoogle({ backgroundColor: optionalColor(paragraphStyle.shading.backgroundColor) }),
      }),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(paragraphStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
