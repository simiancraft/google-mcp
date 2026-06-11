/**
 * The doctor's knowledge of the Google services this suite targets.
 *
 * Dependency direction is one-way: doctor knows services; services never import
 * doctor. To stay decoupled from each service's churning internals, a probe is
 * expressed against stable public surfaces only (`@googleapis/*` plus the shared
 * `authorizedClient`), not `src/<service>` code. Adding a service here is how the
 * doctor learns to check it.
 *
 * Scopes are attributed per service for reporting, but the canonical scope list
 * is `SCOPES` in `src/auth/config.ts` (services do not declare scopes locally).
 * `assertScopeRegistryMatches` guards the two against silent drift.
 */
import { calendar } from '@googleapis/calendar';
import { gmail } from '@googleapis/gmail';
import { sheets } from '@googleapis/sheets';
import { authorizedClient } from '../auth/oauth.js';

/** A cheap, read-only call that proves a service's token + API actually work. */
export type ServiceProbe = (account: string) => Promise<string>;

export type ServiceInfo = {
  name: string;
  /** Google Cloud API identifier to enable (as `gcloud services enable` uses). */
  api: string;
  scopes: string[];
  implemented: boolean;
  probe?: ServiceProbe;
};

// Probe API versions duplicate each service's index.ts on purpose (doctor never
// imports service internals); when a service moves versions, move its probe too.

async function gmailProbe(account: string): Promise<string> {
  const client = gmail({ version: 'v1', auth: await authorizedClient(account) });
  const res = await client.users.getProfile({ userId: 'me' });
  return res.data.emailAddress ?? '(reachable)';
}

async function calendarProbe(account: string): Promise<string> {
  const client = calendar({ version: 'v3', auth: await authorizedClient(account) });
  const res = await client.calendars.get({ calendarId: 'primary' });
  return res.data.summary ?? res.data.timeZone ?? '(reachable)';
}

// The Sheets API has no id-free read (listing spreadsheets is Drive's job), so
// the probe reads Google's long-stable public sample spreadsheet (titled
// "Example Spreadsheet", used throughout the Sheets API docs). If Google ever
// unpublishes it, the probe fails loudly and this id gets replaced.
const SAMPLE_SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';

async function sheetsProbe(account: string): Promise<string> {
  const client = sheets({ version: 'v4', auth: await authorizedClient(account) });
  const res = await client.spreadsheets.get({ spreadsheetId: SAMPLE_SPREADSHEET_ID });
  return res.data.properties?.title ?? '(reachable)';
}

const S = 'https://www.googleapis.com/auth/';

export const SERVICES: ServiceInfo[] = [
  {
    name: 'gmail',
    api: 'gmail.googleapis.com',
    scopes: ['https://mail.google.com/', `${S}gmail.settings.basic`],
    implemented: true,
    probe: gmailProbe,
  },
  { name: 'drive', api: 'drive.googleapis.com', scopes: [`${S}drive`], implemented: false },
  {
    name: 'sheets',
    api: 'sheets.googleapis.com',
    scopes: [`${S}spreadsheets`],
    implemented: true,
    probe: sheetsProbe,
  },
  { name: 'docs', api: 'docs.googleapis.com', scopes: [`${S}documents`], implemented: false },
  {
    name: 'calendar',
    api: 'calendar-json.googleapis.com',
    scopes: [`${S}calendar`],
    implemented: true,
    probe: calendarProbe,
  },
  {
    name: 'meet',
    api: 'meet.googleapis.com',
    scopes: [
      `${S}meetings.space.created`,
      `${S}meetings.space.readonly`,
      `${S}meetings.space.settings`,
    ],
    implemented: false,
  },
];

/** Every scope the suite expects, attributed across services. */
export function requiredScopes(): string[] {
  return SERVICES.flatMap((s) => s.scopes);
}

/** APIs to enable in Google Cloud, in `gcloud services enable` form. */
export function requiredApis(): string[] {
  return SERVICES.map((s) => s.api);
}

/**
 * Guard the per-service scope attribution against the canonical `SCOPES` union.
 * Returns the symmetric difference; empty means the two agree.
 */
export function scopeRegistryDrift(
  canonical: string[],
  declared: string[] = requiredScopes(),
): { missing: string[]; extra: string[] } {
  const have = new Set(declared);
  const truth = new Set(canonical);
  return {
    missing: [...truth].filter((s) => !have.has(s)),
    extra: [...have].filter((s) => !truth.has(s)),
  };
}
