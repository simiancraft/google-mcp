/**
 * Authorize accounts through the browser consent flow, one at a time.
 *
 *   google-mcp-doctor auth you@example.com   # one account, works with no roster
 *   google-mcp-doctor auth --all             # every account in the roster
 *   google-mcp-doctor auth                   # re-auth only what is expired/due
 */
import { runAuthFlow } from '../auth/oauth.js';
import { type Account, loadAccounts, toAccount } from './accounts.js';
import { openInBrowser } from './browser.js';
import { statusFor } from './status.js';

function selectTargets(args: string[]): Account[] {
  const roster = loadAccounts();
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const names = args.filter((a) => !a.startsWith('--'));
  if (names.length > 0) return names.map((n) => toAccount(n, roster));
  if (flags.has('--all')) {
    if (roster.length === 0) {
      throw new Error(
        'No accounts configured. Pass an email: google-mcp-doctor auth you@example.com',
      );
    }
    return roster;
  }
  const now = Date.now();
  return roster.filter((a) => statusFor(a, now).state !== 'fresh');
}

export async function runAuth(args: string[]): Promise<void> {
  const targets = selectTargets(args);
  if (targets.length === 0) {
    console.log('Nothing due; all tokens are fresh. Pass an email/label, or --all to force.');
    return;
  }
  console.log(`Authorizing: ${targets.map((t) => t.label).join(', ')}\n`);
  for (const acct of targets) {
    console.log(`→ ${acct.label}${acct.email ? ` (${acct.email})` : ''}`);
    await runAuthFlow(acct.label, {
      openBrowser: openInBrowser,
      ...(acct.email ? { loginHint: acct.email } : {}),
    });
    console.log('  done.\n');
  }
  console.log('Done. Confirm with: google-mcp-doctor status');
}
