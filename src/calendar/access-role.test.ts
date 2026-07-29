import { describe, expect, it } from 'bun:test';
import { AclRole } from './entities/AclRole.js';
import { CalendarListEntry } from './entities/CalendarListEntry.js';
import { projectCalendarListEntry } from './lib/calendar.js';
import { add_acl_rule } from './methods/add_acl_rule/index.js';
import { schema as addAclRule } from './methods/add_acl_rule/schema.js';
import { schema as listEventInstances } from './methods/list_event_instances/schema.js';

/**
 * Calendar states one access-role vocabulary in several places. `AclRole` is
 * the closed enum, sourced from the discovery document; `CalendarListEntry`
 * and `list_event_instances` carry the same values as prose over open
 * `z.string()` fields, a wire shape EXTENDING.md grandfathers for stability.
 *
 * The type system therefore cannot force a new role to reach those
 * descriptions: adding one to `AclRole` compiles while their prose goes stale,
 * which is exactly the drift that shipped in 1.18.0 and had to be repaired by
 * hand. These pins fail instead.
 *
 * `tools/list_events` is deliberately absent. It transcribes Google's MCP
 * toolset page rather than the discovery document, and that provenance
 * boundary is load-bearing: its prose must follow its own source, not this one.
 */
const roleList = (description: string | undefined): string[] =>
  (description?.split('One of: ')[1] ?? '')
    .replace(/\.$/, '')
    .split(', ')
    .filter((role) => role.length > 0);

describe('calendar access-role vocabulary', () => {
  it('describes the calendar-list entry role with every role except none', () => {
    const documented = roleList(CalendarListEntry.shape.accessRole.description);
    // A calendar you can see is never listed at "none": the effective role on
    // a calendar in your own list is at least freeBusyReader.
    const expected = AclRole.options.filter((role) => role !== 'none');
    expect(documented).toEqual([...expected]);
  });

  it('describes the event-instances role with every role', () => {
    const documented = roleList(listEventInstances.output.shape.accessRole.description);
    expect(documented).toEqual([...AclRole.options]);
  });

  // add_acl_rule states the vocabulary twice more, and both are agent-facing:
  // the operation description an MCP client reads when choosing a tool, and
  // the role field's own description. Neither is derived from AclRole either.
  it('names every role in the grant operation description', () => {
    for (const role of AclRole.options) {
      expect(add_acl_rule.description).toContain(role);
    }
  });

  it('names every role in the grant role field description', () => {
    const described = addAclRule.input.shape.role.description ?? '';
    for (const role of AclRole.options) {
      expect(described).toContain(role);
    }
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
