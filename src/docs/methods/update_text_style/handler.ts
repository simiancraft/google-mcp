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
      textStyle: forGoogle({
        bold: textStyle.bold,
        italic: textStyle.italic,
        underline: textStyle.underline,
        strikethrough: textStyle.strikethrough,
        smallCaps: textStyle.smallCaps,
        baselineOffset: textStyle.baselineOffset,
        fontSize:
          textStyle.fontSize === undefined
            ? undefined
            : { magnitude: textStyle.fontSize, unit: 'PT' },
        link: textStyle.link,
      }),
      // The mask is derived from the provided keys (zod strips unknown ones),
      // so mask and values cannot desync; the key names are the REST JSON
      // field names, which is what FieldMask accepts.
      fields: Object.keys(textStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
