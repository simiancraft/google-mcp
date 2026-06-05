import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/list_drafts */
export const input = z.object({
  query: z.string().optional(),
  pageSize: z.number().int().max(50).optional(),
  pageToken: z.string().optional(),
});

export const output = z.object({
  drafts: z.array(Draft),
  nextPageToken: z.string().optional(),
});
