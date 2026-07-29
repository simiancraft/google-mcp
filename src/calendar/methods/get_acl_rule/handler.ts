import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { projectAclRule } from '../../lib/acl.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.acl.get({
    calendarId: args.calendarId ?? 'primary',
    ruleId: args.ruleId,
  });
  return projectAclRule(data);
}
