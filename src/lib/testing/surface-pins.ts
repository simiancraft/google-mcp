import { expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type CapabilityGroup, renderCapabilities } from '../capabilities.js';
import { untrustedContentInstructions } from '../instructions.js';
import { mergeOperations, SOURCE_META_KEY } from '../operation.js';
import { toolDefinitions } from '../server.js';

/**
 * The per-wing surface-pin data: everything a service must keep current when
 * its surface changes. The expected counts, annotation sets, and URL prefixes
 * stay in the wing (transcription explicitness); the assertion ceremony lives
 * here once.
 */
type CommonPins<Client> = {
  /** The wing test's `import.meta.url`; CAPABILITIES.md is read from beside it. */
  moduleUrl: string;
  /** The doc title the wing's capabilities.ts renders with. */
  capabilitiesTitle: string;
  /** The served instructions string. */
  instructions: string;
  /** The wing's registries, in rendered order (tools first where present). */
  groups: CapabilityGroup<Client>[];
  /** The service+version-exact prefix every method's `source` must start with. */
  methodSourcePrefix: `https://${string}`;
  readOnly: string[];
  destructive: string[];
  openWorld: string[];
};

/**
 * Tools-bearing wings must supply both the toolset page prefix and the tool
 * count; methods-only wings can supply neither. The union makes the mismatch
 * (a tool count without its URL prefix, or vice versa) a compile error
 * instead of a runtime comparison against the string "undefined".
 */
export type SurfacePins<Client> =
  | (CommonPins<Client> & {
      /** The exact page-URL prefix; each tool's `source` must be `prefix + its wire name`. */
      toolSourcePrefix: `https://${string}`;
      counts: { tools: number; methods: number };
    })
  | (CommonPins<Client> & {
      toolSourcePrefix?: undefined;
      counts: { tools?: undefined; methods: number };
    });

/**
 * Every object node in a JSON Schema that is not strict
 * (`additionalProperties: false`). Strictness must hold at every depth: a
 * nested unknown key (an agent typo inside textStyle, criteria, ...) silently
 * strips under plain `z.object`, which is worse than a loud rejection.
 */
export function nonStrictObjectPaths(node: unknown, path: string): string[] {
  if (typeof node !== 'object' || node === null) return [];
  const rec = node as Record<string, unknown>;
  const own =
    rec['type'] === 'object' &&
    rec['properties'] !== undefined &&
    rec['additionalProperties'] !== false
      ? [path]
      : [];
  return own.concat(
    Object.entries(rec).flatMap(([key, child]) => nonStrictObjectPaths(child, `${path}.${key}`)),
  );
}

/**
 * Register the suite-wide surface pins for one wing: counts, definition
 * completeness, strict inputs on the wire, instructions citing the real
 * `_meta` key and only real operation names, source citations with
 * service-exact prefixes, the explicit four-hint quad, the exact
 * read-only/destructive/open-world sets, and CAPABILITIES.md equality.
 * Call inside the wing's `describe` block.
 */
export function pinOperationSurface<Client>(pins: SurfacePins<Client>): void {
  const tools = pins.groups.find((g) => g.kind === 'MCP Tool')?.operations ?? {};
  const methods = pins.groups.find((g) => g.kind === 'REST Method')?.operations ?? {};
  const operations = mergeOperations(...pins.groups.map((g) => g.operations));

  it('exposes the full surface (pinned counts)', () => {
    if (pins.counts.tools !== undefined) {
      expect(Object.keys(tools)).toHaveLength(pins.counts.tools);
    }
    expect(Object.keys(methods)).toHaveLength(pins.counts.methods);
    expect(Object.keys(operations)).toHaveLength((pins.counts.tools ?? 0) + pins.counts.methods);
  });

  it('every operation has a description, a schema, and a handler', () => {
    for (const op of Object.values(operations)) {
      expect(op.description.length).toBeGreaterThan(0);
      expect(op.schema.input).toBeDefined();
      expect(op.schema.output).toBeDefined();
      expect(typeof op.handler).toBe('function');
    }
  });

  it('declares strict inputs on the wire (additionalProperties: false, recursively)', () => {
    for (const def of toolDefinitions(operations)) {
      expect(nonStrictObjectPaths(def.inputSchema, def.name)).toEqual([]);
    }
  });

  it('instructions cite the _meta key, carry the content advisory, and name only real operations', () => {
    expect(pins.instructions).toContain(SOURCE_META_KEY);
    expect(pins.instructions).toContain(untrustedContentInstructions().trim());
    const mentioned = pins.instructions.match(/\b[a-z]+(?:_[a-z]+)+\b/g) ?? [];
    expect(mentioned.length).toBeGreaterThan(0);
    for (const name of mentioned) {
      expect(operations).toHaveProperty(name);
    }
  });

  it('cites the matching reference page on every operation', () => {
    // The union guarantees a prefix wherever tools exist; the fallback only
    // keeps the template typed, and an impossible mismatch still fails loudly.
    const toolPrefix = pins.toolSourcePrefix ?? 'https://';
    for (const [name, op] of Object.entries(tools)) {
      expect(op.source).toBe(`${toolPrefix}${name}`);
    }
    for (const op of Object.values(methods)) {
      expect(op.source).toStartWith(pins.methodSourcePrefix);
      expect(op.source).not.toContain('mcp/tools_list');
    }
  });

  it('annotates every operation with the four MCP hints, explicitly', () => {
    for (const op of Object.values(operations)) {
      expect(typeof op.annotations.readOnlyHint).toBe('boolean');
      expect(typeof op.annotations.destructiveHint).toBe('boolean');
      expect(typeof op.annotations.idempotentHint).toBe('boolean');
      expect(typeof op.annotations.openWorldHint).toBe('boolean');
    }
  });

  const named = (hint: 'readOnlyHint' | 'destructiveHint' | 'openWorldHint') =>
    Object.entries(operations)
      .filter(([, op]) => op.annotations[hint])
      .map(([name]) => name)
      .sort();

  it('marks exactly the read-only operations', () => {
    expect(named('readOnlyHint')).toEqual([...pins.readOnly].sort());
  });

  it('marks exactly the destructive operations', () => {
    expect(named('destructiveHint')).toEqual([...pins.destructive].sort());
  });

  it('marks exactly the open-world operations', () => {
    expect(named('openWorldHint')).toEqual([...pins.openWorld].sort());
  });

  it('CAPABILITIES.md is the current render of these registries', () => {
    const doc = readFileSync(fileURLToPath(new URL('./CAPABILITIES.md', pins.moduleUrl)), 'utf8');
    expect(doc).toBe(renderCapabilities(pins.capabilitiesTitle, pins.groups));
  });
}
