import { z } from 'zod';
import { Label } from '../../entities/Label.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_labels */
export const input = z.object({
  pageSize: z.number().int().optional(),
  pageToken: z.string().optional(),
});

export const output = z.object({
  labels: z.array(Label),
  nextPageToken: z.string().optional(),
});
