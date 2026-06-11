import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type CapabilityGroup, renderCapabilities } from './server.js';

/**
 * Write CAPABILITIES.md beside the calling bootstrap module: each service's
 * `capabilities.ts` passes its own `import.meta.url`, so the doc always lands
 * next to the registries it renders, and the wing's equality test can pin the
 * committed file to `renderCapabilities` of the live registries.
 */
export function writeCapabilities<Client>(
  moduleUrl: string,
  title: string,
  groups: CapabilityGroup<Client>[],
): void {
  const out = fileURLToPath(new URL('./CAPABILITIES.md', moduleUrl));
  writeFileSync(out, renderCapabilities(title, groups));
  const count = groups.reduce((n, group) => n + Object.keys(group.operations).length, 0);
  console.error(`Wrote CAPABILITIES.md (${count} operations)`);
}
