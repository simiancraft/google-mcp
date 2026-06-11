import type { calendar_v3 } from '@googleapis/calendar';
import type { Optional } from '../../lib/optionality.js';

/**
 * Apply attendee email deltas to a REST attendee array: drop the removed
 * addresses, then append the added ones as bare attendees. Addresses compare
 * case-insensitively, and an added address that is already on the list is
 * skipped rather than duplicated.
 */
export function applyAttendeeDeltas(
  attendees: calendar_v3.Schema$EventAttendee[],
  deltas: { added?: Optional<string[]>; removed?: Optional<string[]> },
): calendar_v3.Schema$EventAttendee[] {
  const removed = new Set((deltas.removed ?? []).map((email) => email.toLowerCase()));
  const kept = attendees.filter((attendee) => !removed.has((attendee.email ?? '').toLowerCase()));
  const present = new Set(kept.map((attendee) => (attendee.email ?? '').toLowerCase()));
  const result = [...kept];
  for (const email of deltas.added ?? []) {
    if (present.has(email.toLowerCase())) {
      continue;
    }
    present.add(email.toLowerCase());
    result.push({ email });
  }
  return result;
}

/**
 * Rewrite the self attendee's invitation response in a REST attendee array:
 * set its `responseStatus` and, when a comment is given, its `comment`,
 * leaving every other attendee untouched. Throws when no attendee carries
 * `self: true`: the authenticated user is not on the guest list, so there is
 * no response of theirs to rewrite.
 */
export function respondAsSelf(
  attendees: calendar_v3.Schema$EventAttendee[],
  response: {
    responseStatus: 'declined' | 'tentative' | 'accepted';
    comment?: Optional<string>;
  },
): calendar_v3.Schema$EventAttendee[] {
  const self = attendees.find((attendee) => attendee.self === true);
  if (self === undefined) {
    throw new Error(
      'The event has no self attendee; the authenticated user is not on the guest list, so there is no response to set.',
    );
  }
  return attendees.map((attendee) =>
    attendee === self
      ? {
          ...attendee,
          responseStatus: response.responseStatus,
          ...(response.comment === undefined ? {} : { comment: response.comment }),
        }
      : attendee,
  );
}
