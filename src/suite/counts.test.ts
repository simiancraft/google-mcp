import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { methods as calendarMethods } from '../calendar/methods/registry.js';
import { tools as calendarTools } from '../calendar/tools/registry.js';
import { methods as docsMethods } from '../docs/methods/registry.js';
import { methods as driveMethods } from '../drive/methods/registry.js';
import { tools as driveTools } from '../drive/tools/registry.js';
import { methods as gmailMethods } from '../gmail/methods/registry.js';
import { tools as gmailTools } from '../gmail/tools/registry.js';
import { methods as sheetsMethods } from '../sheets/methods/registry.js';

/**
 * The surface pins stop at each service's CAPABILITIES.md; README.md and
 * ADOPTING.md hand-mirror the operation counts at the repo's front door, so
 * they staled silently on every surface change until this pin. Every number
 * that sits next to a CAPABILITIES.md link, and every total, must equal the
 * live registries.
 */
const counts = {
  gmail: Object.keys(gmailTools).length + Object.keys(gmailMethods).length,
  calendar: Object.keys(calendarTools).length + Object.keys(calendarMethods).length,
  drive: Object.keys(driveTools).length + Object.keys(driveMethods).length,
  sheets: Object.keys(sheetsMethods).length,
  docs: Object.keys(docsMethods).length,
};
const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

const root = join(import.meta.dir, '../..');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const adopting = readFileSync(join(root, 'ADOPTING.md'), 'utf8');

describe('front-door operation counts', () => {
  it('README totals match the registries', () => {
    expect(readme).toContain(`${total} self-describing operations`);
    expect(readme).toContain(`<strong>${total} operations</strong> ship today`);
  });

  it('every count beside a CAPABILITIES.md link matches its registry', () => {
    const links = [
      ...readme.matchAll(/href="\.\/src\/(\w+)\/CAPABILITIES\.md">(\d+)<\/a>/g),
      ...readme.matchAll(/\[(\d+)(?: operations)?\]\(\.\/src\/(\w+)\/CAPABILITIES\.md\)/g),
    ];
    expect(links.length).toBeGreaterThan(0);
    for (const match of links) {
      const [, first, second] = match;
      const [service, count] = /^\d+$/.test(first as string)
        ? [second as string, Number(first)]
        : [first as string, Number(second)];
      expect({ service, count }).toEqual({
        service,
        count: counts[service as keyof typeof counts],
      });
    }
  });

  it('ADOPTING totals and per-service counts match the registries', () => {
    expect(adopting).toContain(`[${total} operations]`);
    expect(adopting).toContain(
      `Gmail (${counts.gmail}), Calendar (${counts.calendar}), Drive (${counts.drive}), Sheets (${counts.sheets}), and Docs (${counts.docs})`,
    );
  });
});
