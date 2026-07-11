/**
 * The browser OAuth consent flow for the admin UI. Tokens are minted with the
 * same library (`google-auth-library`), the same `SCOPES`, the same
 * offline/consent/PKCE flow, and persisted as the same `JSON.stringify(tokens)`
 * bytes the suite's `runAuthFlow` writes, so an account authorized here is
 * indistinguishable from one authorized via `google-mcp-doctor auth`.
 *
 * Where `runAuthFlow` runs its own loopback HTTP server and opens a browser,
 * this flow is web-driven: the UI asks for an auth URL, the user approves, and
 * the callback either auto-completes (local) or the user pastes the redirected
 * URL back (headless/remote).
 */
import { randomBytes } from 'node:crypto';
import { chmodSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import { SCOPES } from '../../auth/config.js';
import { loadClientKeys } from './clientSecret.js';
import { tokenPath, tokensDir } from './paths.js';

/** The loopback redirect URI; matched at both authorize and token-exchange time. */
export function redirectUri(): string {
  const base =
    process.env['OAUTH_REDIRECT_BASE']?.trim() || `http://localhost:${process.env['PORT'] ?? 3000}`;
  return `${base.replace(/\/+$/, '')}/admin/oauth/callback`;
}

interface Pending {
  codeVerifier: string;
  account: string;
  redirectUri: string;
  createdAt: number;
}

const PENDING_TTL_MS = 10 * 60 * 1000;
const pending = new Map<string, Pending>();

function sweepPending(): void {
  const cutoff = Date.now() - PENDING_TTL_MS;
  for (const [state, p] of pending) {
    if (p.createdAt < cutoff) pending.delete(state);
  }
}

export async function startAuth(account: string): Promise<{ authUrl: string; state: string }> {
  const keys = loadClientKeys();
  if (!keys) throw new Error('No client_secret.json yet — upload the OAuth client first.');

  const redirect = redirectUri();
  const client = new OAuth2Client(keys.client_id, keys.client_secret, redirect);
  const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
  if (!codeChallenge) throw new Error('PKCE challenge generation failed.');

  const state = randomBytes(16).toString('hex');
  const loginHint = account.includes('@') ? account : undefined;
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
    code_challenge_method: CodeChallengeMethod.S256,
    code_challenge: codeChallenge,
    ...(loginHint ? { login_hint: loginHint } : {}),
  });

  sweepPending();
  pending.set(state, { codeVerifier, account, redirectUri: redirect, createdAt: Date.now() });
  return { authUrl, state };
}

/** Exchange an authorization code for tokens and persist them exactly as the suite does. */
export async function completeAuth(state: string, code: string): Promise<string> {
  const p = pending.get(state);
  if (!p) throw new Error('Unknown or expired authorization (state mismatch). Start again.');

  const keys = loadClientKeys();
  if (!keys) throw new Error('client_secret.json is missing.');

  const client = new OAuth2Client(keys.client_id, keys.client_secret, p.redirectUri);
  const { tokens } = await client.getToken({ code, codeVerifier: p.codeVerifier });

  const dir = tokensDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700); // mkdir's mode only applies on create; tighten a pre-existing dir.
  const file = tokenPath(p.account);
  rmSync(file, { force: true }); // recreate so 0600 applies to fresh bytes, never a looser pre-existing mode.
  writeFileSync(file, JSON.stringify(tokens), { mode: 0o600 });

  pending.delete(state);
  return p.account;
}
