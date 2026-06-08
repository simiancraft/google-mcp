import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { projectDraft } from '../../lib/message.js';
import type { schema } from './schema.js';

export async function handler(
  gmail: gmail_v1.Gmail,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const list = await gmail.users.drafts.list({
    userId: 'me',
    q: args.query,
    maxResults: args.pageSize ?? 10,
    pageToken: args.pageToken,
  });

  const stubs = list.data.drafts ?? [];
  const drafts = await Promise.all(
    stubs.map(async (stub) => {
      const { data } = await gmail.users.drafts.get({
        userId: 'me',
        id: stub.id ?? undefined,
        format: 'full',
      });
      return projectDraft(data);
    }),
  );

  return { drafts, nextPageToken: list.data.nextPageToken ?? undefined };
}
