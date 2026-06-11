import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectFilter } from '../../lib/filter.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.settings.filters.create({
    userId: 'me',
    requestBody: { criteria: forGoogle(args.criteria), action: forGoogle(args.action) },
  });
  return projectFilter(data);
}
