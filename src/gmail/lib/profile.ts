import type { gmail_v1 } from '@googleapis/gmail';

/**
 * The authenticated account's email address, for the `From` header when
 * composing messages. A server instance is bound to one account, so the address
 * is stable; the in-flight promise is memoized on the client (WeakMap), which
 * collapses `getProfile` to one call per process, lets concurrent composes share
 * it, and stays per-instance, test-safe, and garbage-collected with the client.
 */
const cache = new WeakMap<gmail_v1.Gmail, Promise<string>>();

export function senderAddress(gmail: gmail_v1.Gmail): Promise<string> {
  let pending = cache.get(gmail);
  if (!pending) {
    pending = gmail.users.getProfile({ userId: 'me' }).then((res) => res.data.emailAddress ?? 'me');
    cache.set(gmail, pending);
  }
  return pending;
}
