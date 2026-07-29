import { describe, expect, it } from 'bun:test';
import { AclRule } from '../entities/AclRule.js';
import { projectAclRule } from './acl.js';

describe('projectAclRule', () => {
  it('projects a rule, dropping the REST-only fields', () => {
    const result = projectAclRule({
      etag: '"abc"',
      kind: 'calendar#aclRule',
      id: 'user:someone@example.com',
      role: 'freeBusyReader',
      scope: { type: 'user', value: 'someone@example.com' },
    });
    expect(result).toEqual({
      id: 'user:someone@example.com',
      role: 'freeBusyReader',
      scope: { type: 'user', value: 'someone@example.com' },
    });
    expect(() => AclRule.parse(result)).not.toThrow();
  });

  it('keeps the public scope, which carries no value', () => {
    const result = projectAclRule({ id: 'default', role: 'reader', scope: { type: 'default' } });
    expect(result).toEqual({ id: 'default', role: 'reader', scope: { type: 'default' } });
  });

  it('cleans nulls to undefined and falls back to a sentinel id', () => {
    const result = projectAclRule({ id: null, role: null, scope: null });
    expect(result).toEqual({ id: '', role: undefined, scope: undefined });
  });

  it('drops an unknown role rather than passing it through', () => {
    const result = projectAclRule({
      id: 'user:someone@example.com',
      role: 'superOwner',
      scope: { type: 'user', value: 'someone@example.com' },
    });
    expect(result.role).toBeUndefined();
    expect(() => AclRule.parse(result)).not.toThrow();
  });

  it('drops the whole scope when its type is unknown, never a scope without a type', () => {
    const result = projectAclRule({
      id: 'ring:eng@example.com',
      role: 'reader',
      scope: { type: 'ring', value: 'eng@example.com' },
    });
    expect(result.scope).toBeUndefined();
    expect(() => AclRule.parse(result)).not.toThrow();
  });
});
