import { describe, expect, it } from 'bun:test';
import { AclRole } from './entities/AclRole.js';
import { CalendarListEntry } from './entities/CalendarListEntry.js';
import { projectCalendarListEntry } from './lib/calendar.js';
import { describeRoles, EFFECTIVE_ROLES, listRoles } from './lib/roles.js';
import { add_acl_rule } from './methods/add_acl_rule/index.js';
import { schema as addAclRule } from './methods/add_acl_rule/schema.js';
import { schema as listEventInstances } from './methods/list_event_instances/schema.js';

/**
 * Calendar states one access-role vocabulary on four agent-facing surfaces.
 * `AclRole` is the closed enum, sourced from the discovery document;
 * `CalendarListEntry` and `list_event_instances` carry the same values as
 * prose over open `z.string()` fields, a wire shape EXTENDING.md grandfathers
 * for stability, and `add_acl_rule` states it twice more.
 *
 * All four now render from `lib/roles.ts`, so the drift that shipped in 1.18.0
 * (a new discovery role reaching the enum while every description kept the old
 * list) cannot recur: the gloss map is keyed by `AclRole`, so an undescribed
 * role fails to compile. These tests pin the rendering itself, since a
 * substring check cannot: `writerWithoutPrivateAccess` contains `writer`, and
 * the `owner` gloss mentions `writer` too, so scanning prose for role names
 * stays green even after the standalone entry is deleted.
 *
 * `tools/list_events` is deliberately absent. It transcribes Google's MCP
 * toolset page rather than the discovery document, and that provenance
 * boundary is load-bearing: its prose must follow its own source, not this one.
 */
const enumerated = (description: string | undefined): string[] =>
  (description?.split('One of: ')[1] ?? '').replace(/\.$/, '').split(', ');

describe('calendar access-role vocabulary', () => {
  it('renders the effective roles as every role except none', () => {
    expect([...EFFECTIVE_ROLES]).toEqual(AclRole.options.filter((role) => role !== 'none'));
  });

  it('enumerates the effective roles on the calendar-list entry', () => {
    expect(enumerated(CalendarListEntry.shape.accessRole.description)).toEqual([
      ...EFFECTIVE_ROLES,
    ]);
  });

  it('enumerates every role on event instances', () => {
    expect(enumerated(listEventInstances.output.shape.accessRole.description)).toEqual([
      ...AclRole.options,
    ]);
  });

  it('glosses every role, in order, on the grant input', () => {
    expect(addAclRule.input.shape.role.description).toBe(`The role to grant: ${describeRoles()}.`);
  });

  it('names every role in the grant operation description', () => {
    expect(add_acl_rule.description).toContain(`granting a role (${listRoles()})`);
  });

  it('preserves writerWithoutPrivateAccess through the calendar-list projection', () => {
    const projected = projectCalendarListEntry({
      id: 'team@example.com',
      accessRole: 'writerWithoutPrivateAccess',
    });
    expect(projected.accessRole).toBe('writerWithoutPrivateAccess');
    expect(() => CalendarListEntry.parse(projected)).not.toThrow();
  });
});
