/** Inventory of authorized accounts, read from the per-account token files. */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { tokenPath, tokensDir, validAccount } from './paths.js';

export interface AccountInfo {
  account: string;
  scopes: number;
  expiry: number | null;
  hasRefresh: boolean;
}

/** Every authorized account (one token file each), with a summary of its token. */
export function listAccounts(): AccountInfo[] {
  const dir = tokensDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const account = f.replace(/\.json$/, '');
      let scopes = 0;
      let expiry: number | null = null;
      let hasRefresh = false;
      try {
        const t = JSON.parse(readFileSync(path.join(dir, f), 'utf8')) as {
          scope?: string;
          expiry_date?: number;
          refresh_token?: string;
        };
        scopes = t.scope ? t.scope.split(/\s+/).filter(Boolean).length : 0;
        expiry = typeof t.expiry_date === 'number' ? t.expiry_date : null;
        hasRefresh = Boolean(t.refresh_token);
      } catch {
        /* show the file even if it is unparseable */
      }
      return { account, scopes, expiry, hasRefresh };
    })
    .sort((a, b) => a.account.localeCompare(b.account));
}

/** True if `account` has a stored token (i.e. has been authorized). */
export function accountAuthorized(account: string): boolean {
  return validAccount(account) && existsSync(tokenPath(account));
}

/** Labels of every authorized account. */
export function authorizedAccounts(): string[] {
  return listAccounts().map((a) => a.account);
}
