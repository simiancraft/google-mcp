import { describe, expect, it } from 'bun:test';
import type { gmail_v1 } from 'googleapis';
import { senderAddress } from './profile.js';

function fakeGmail(counter: { calls: number }): gmail_v1.Gmail {
  return {
    users: {
      getProfile: async () => {
        counter.calls += 1;
        return { data: { emailAddress: 'me@example.com' } };
      },
    },
  } as unknown as gmail_v1.Gmail;
}

describe('senderAddress', () => {
  it('returns the account email', async () => {
    expect(await senderAddress(fakeGmail({ calls: 0 }))).toBe('me@example.com');
  });

  it('memoizes per client: one getProfile across repeated calls on the same client', async () => {
    const counter = { calls: 0 };
    const gmail = fakeGmail(counter);
    await senderAddress(gmail);
    await senderAddress(gmail);
    await senderAddress(gmail);
    expect(counter.calls).toBe(1);
  });

  it('does not share the cache across different clients', async () => {
    const a = { calls: 0 };
    const b = { calls: 0 };
    await senderAddress(fakeGmail(a));
    await senderAddress(fakeGmail(b));
    expect(a.calls).toBe(1);
    expect(b.calls).toBe(1);
  });
});
