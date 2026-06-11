import { randomUUID } from 'node:crypto';
import type { calendar_v3 } from '@googleapis/calendar';
import type { Optional } from '../../lib/optionality.js';

/**
 * The conference payload for the requested Meet handling: an explicit
 * googleMeetUrl attaches as a video entry point and wins over
 * addGoogleMeetUrl, which asks Google to mint a new Meet link via a create
 * request. Writing conference data requires conferenceDataVersion 1 on the
 * query; handlers set it whenever this returns a payload.
 */
export function meetConferenceData(args: {
  addGoogleMeetUrl?: Optional<boolean>;
  googleMeetUrl?: Optional<string>;
}): Optional<calendar_v3.Schema$ConferenceData> {
  if (args.googleMeetUrl !== undefined) {
    return { entryPoints: [{ entryPointType: 'video', uri: args.googleMeetUrl }] };
  }
  if (args.addGoogleMeetUrl) {
    return {
      createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
    };
  }
  return undefined;
}
