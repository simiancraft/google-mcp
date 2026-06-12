import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.settings.list(
    forGoogle({
      maxResults: args.maxResults,
      pageToken: args.pageToken,
    }),
  );
  return {
    settings: (data.items ?? []).map((setting) => ({
      id: setting.id ?? '',
      value: setting.value ?? '',
    })),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
