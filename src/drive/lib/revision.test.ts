import { describe, expect, it } from 'bun:test';
import { Revision } from '../entities/Revision.js';
import { projectRevision, REVISION_FIELDS } from './revision.js';

describe('projectRevision', () => {
  it('projects the documented fields with the last modifying user', () => {
    const projected = projectRevision({
      id: 'V2',
      mimeType: 'image/png',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      keepForever: true,
      size: '2048',
      originalFilename: 'photo.png',
      md5Checksum: 'abc123',
      lastModifyingUser: { displayName: 'Ada', me: true },
    });
    expect(projected).toEqual({
      id: 'V2',
      mimeType: 'image/png',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      keepForever: true,
      size: '2048',
      originalFilename: 'photo.png',
      md5Checksum: 'abc123',
      lastModifyingUser: { displayName: 'Ada', me: true },
    });
    expect(() => Revision.parse(projected)).not.toThrow();
  });

  it('cleans an empty revision to the id sentinel', () => {
    const projected = projectRevision({});
    expect(projected.id).toBe('');
    expect(projected.lastModifyingUser).toBeUndefined();
    expect(() => Revision.parse(projected)).not.toThrow();
  });
});

describe('REVISION_FIELDS', () => {
  it('requests exactly what the projection consumes', () => {
    expect(REVISION_FIELDS).toContain('keepForever');
    expect(REVISION_FIELDS).toContain('lastModifyingUser(');
  });
});
