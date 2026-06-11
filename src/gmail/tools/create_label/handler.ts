import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectLabel } from '../../lib/label.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.labels.create({
    userId: 'me',
    requestBody: forGoogle({ name: args.displayName, color: args.color }),
  });
  return projectLabel(data);
}
