import type { gmail_v1 } from 'googleapis';

/**
 * The authenticated account's email address, for the `From` header when
 * composing messages. One `getProfile` call; a candidate for process-scoped
 * memoization in the efficiency pass (a server instance is bound to one account).
 */
export async function senderAddress(gmail: gmail_v1.Gmail): Promise<string> {
  const { data } = await gmail.users.getProfile({ userId: 'me' });
  return data.emailAddress ?? 'me';
}
