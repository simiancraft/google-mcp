import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectAclRule } from '../../lib/acl.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.acl.insert(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      sendNotifications: args.sendNotifications,
      // The scope union guarantees the type/value pairing Google accepts but
      // does not enforce, so it crosses the boundary as it stands.
      requestBody: { role: args.role, scope: args.scope },
    }),
  );
  return projectAclRule(data);
}
