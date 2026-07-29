/** The shared OAuth app credentials (`client_secret.json`), read/written byte-identically to the suite. */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { clientSecretPath, googleMcpDir } from './paths.js';

export interface ClientKeys {
  client_id: string;
  client_secret: string;
}

/** Read the shared OAuth client (`installed` or `web` shape), or undefined if absent/invalid. */
export function loadClientKeys(): ClientKeys | undefined {
  const p = clientSecretPath();
  if (!existsSync(p)) return undefined;
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8')) as {
      installed?: Partial<ClientKeys>;
      web?: Partial<ClientKeys>;
    };
    const keys = raw.installed ?? raw.web;
    if (keys?.client_id && keys.client_secret) {
      return { client_id: keys.client_id, client_secret: keys.client_secret };
    }
  } catch {
    /* fall through to undefined */
  }
  return undefined;
}

/** Validate and persist an uploaded `client_secret.json` (0600 in the 0700 config dir). */
export function saveClientSecret(body: unknown): void {
  const parsed = typeof body === 'string' ? (JSON.parse(body) as unknown) : (body as unknown);
  const raw = parsed as { installed?: Partial<ClientKeys>; web?: Partial<ClientKeys> };
  const keys = raw?.installed ?? raw?.web;
  if (!keys?.client_id || !keys.client_secret) {
    throw new Error(
      'Invalid client secret: expected an "installed" or "web" object with client_id/client_secret.',
    );
  }
  const dir = googleMcpDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const p = clientSecretPath();
  // Recreate so 0600 applies to fresh bytes, never a looser pre-existing mode.
  rmSync(p, { force: true });
  writeFileSync(p, JSON.stringify(parsed), { mode: 0o600 });
}
