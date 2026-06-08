import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { projectLabel } from '../../lib/label.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await gmail.users.labels.patch({
    userId: 'me',
    id: args.labelId,
    requestBody: { name: args.name, color: args.color },
  });
  return projectLabel(data);
}
