import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { projectFilter } from '../../lib/filter.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.settings.filters.create({
    userId: 'me',
    requestBody: { criteria: args.criteria, action: args.action },
  });
  return projectFilter(data);
}
