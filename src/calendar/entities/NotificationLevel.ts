import { z } from 'zod';

/**
 * Which email notification Google Calendar sends about an event write: NONE
 * (no notifications), EXTERNAL_ONLY (only attendees outside Google Calendar),
 * or ALL (all attendees).
 *
 * An input enum on the write tools, defaulting to NONE when unset. The REST
 * API spells the same choice as the `sendUpdates` query parameter;
 * `lib/notifications.ts` owns that mapping.
 *
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/create_event
 */
export const NotificationLevel = z.enum(['NONE', 'EXTERNAL_ONLY', 'ALL']);

export type NotificationLevel = z.infer<typeof NotificationLevel>;
