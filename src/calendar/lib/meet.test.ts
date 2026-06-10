import { describe, expect, it } from 'bun:test';
import { meetConferenceData } from './meet.js';

describe('meetConferenceData', () => {
  it('attaches an existing Meet URL as a video entry point, winning over addGoogleMeetUrl', () => {
    expect(
      meetConferenceData({
        addGoogleMeetUrl: true,
        googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
      }),
    ).toEqual({
      entryPoints: [{ entryPointType: 'video', uri: 'https://meet.google.com/abc-defg-hij' }],
    });
  });

  it('mints a new Meet link via a conference create request', () => {
    expect(meetConferenceData({ addGoogleMeetUrl: true })).toEqual({
      createRequest: {
        requestId: expect.any(String),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    });
  });

  it('returns no payload when neither Meet input is given', () => {
    expect(meetConferenceData({})).toBeUndefined();
  });
});
