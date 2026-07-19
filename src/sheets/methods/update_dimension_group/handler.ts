import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toDimensionRange } from '../../lib/layout.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths({ collapsed: args.dimensionGroup.collapsed });
  await applyRequest(sheets, args.spreadsheetId, {
    updateDimensionGroup: {
      dimensionGroup: {
        range: toDimensionRange(args.dimensionGroup.range),
        depth: args.dimensionGroup.depth,
        collapsed: args.dimensionGroup.collapsed,
      },
      fields,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    dimensionGroup: args.dimensionGroup,
    updatedFields: fields,
  };
}
