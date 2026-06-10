import type { Optional } from '../../lib/types.js';
import type { NotificationLevel } from '../entities/NotificationLevel.js';

/** The REST `sendUpdates` value for each notification level. */
const sendUpdates = {
  NONE: 'none',
  EXTERNAL_ONLY: 'externalOnly',
  ALL: 'all',
} as const;

/**
 * Map a write tool's `notificationLevel` input onto the REST `sendUpdates`
 * query parameter; an unset level means NONE (send no notification emails).
 */
export function toSendUpdates(
  level: Optional<NotificationLevel>,
): (typeof sendUpdates)[NotificationLevel] {
  return sendUpdates[level ?? 'NONE'];
}
