import { describe, expect, it } from 'bun:test';
import { applyAttendeeDeltas, respondAsSelf } from './attendees.js';

describe('applyAttendeeDeltas', () => {
  it('returns the guest list unchanged when there are no deltas', () => {
    expect(applyAttendeeDeltas([{ email: 'a@example.com' }], {})).toEqual([
      { email: 'a@example.com' },
    ]);
  });

  it('appends added addresses as bare attendees', () => {
    expect(
      applyAttendeeDeltas([{ email: 'a@example.com', responseStatus: 'accepted' }], {
        added: ['b@example.com'],
      }),
    ).toEqual([{ email: 'a@example.com', responseStatus: 'accepted' }, { email: 'b@example.com' }]);
  });

  it('drops removed addresses, comparing case-insensitively', () => {
    expect(
      applyAttendeeDeltas([{ email: 'A@Example.com' }, { email: 'b@example.com' }], {
        removed: ['a@example.com'],
      }),
    ).toEqual([{ email: 'b@example.com' }]);
  });

  it('applies adds and removes together', () => {
    expect(
      applyAttendeeDeltas([{ email: 'a@example.com' }, { email: 'b@example.com' }], {
        added: ['c@example.com'],
        removed: ['b@example.com'],
      }),
    ).toEqual([{ email: 'a@example.com' }, { email: 'c@example.com' }]);
  });

  it('skips an added address that is already on the list', () => {
    expect(applyAttendeeDeltas([{ email: 'a@example.com' }], { added: ['A@EXAMPLE.COM'] })).toEqual(
      [{ email: 'a@example.com' }],
    );
  });

  it('adds a repeated new address only once', () => {
    expect(applyAttendeeDeltas([], { added: ['b@example.com', 'B@example.com'] })).toEqual([
      { email: 'b@example.com' },
    ]);
  });

  it('keeps an attendee with no email address (a room resource) through a removal', () => {
    expect(
      applyAttendeeDeltas([{ displayName: 'Room 1', resource: true }, { email: 'a@example.com' }], {
        removed: ['a@example.com'],
      }),
    ).toEqual([{ displayName: 'Room 1', resource: true }]);
  });
});

describe('respondAsSelf', () => {
  it("rewrites the self attendee's responseStatus, leaving every other attendee untouched", () => {
    expect(
      respondAsSelf(
        [
          { email: 'organizer@example.com', organizer: true, responseStatus: 'accepted' },
          { email: 'me@example.com', self: true, responseStatus: 'needsAction' },
        ],
        { responseStatus: 'accepted' },
      ),
    ).toEqual([
      { email: 'organizer@example.com', organizer: true, responseStatus: 'accepted' },
      { email: 'me@example.com', self: true, responseStatus: 'accepted' },
    ]);
  });

  it('sets the comment when one is given', () => {
    expect(
      respondAsSelf([{ email: 'me@example.com', self: true }], {
        responseStatus: 'tentative',
        comment: 'I may be travelling.',
      }),
    ).toEqual([
      {
        email: 'me@example.com',
        self: true,
        responseStatus: 'tentative',
        comment: 'I may be travelling.',
      },
    ]);
  });

  it('keeps an existing comment when none is given', () => {
    expect(
      respondAsSelf([{ email: 'me@example.com', self: true, comment: 'maybe' }], {
        responseStatus: 'declined',
      }),
    ).toEqual([
      { email: 'me@example.com', self: true, responseStatus: 'declined', comment: 'maybe' },
    ]);
  });

  it('throws when no attendee is marked self', () => {
    expect(() =>
      respondAsSelf([{ email: 'a@example.com', self: false }], { responseStatus: 'accepted' }),
    ).toThrow('no self attendee');
  });

  it('throws on an empty guest list', () => {
    expect(() => respondAsSelf([], { responseStatus: 'tentative' })).toThrow('no self attendee');
  });
});
