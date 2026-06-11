import { describe, expect, it } from 'bun:test';
import { SharedDrive } from '../entities/SharedDrive.js';
import { projectSharedDrive, SHARED_DRIVE_FIELDS } from './shared-drive.js';

describe('projectSharedDrive', () => {
  it('projects the documented fields with restrictions', () => {
    const projected = projectSharedDrive({
      id: 'D1',
      name: 'Marketing',
      colorRgb: '#ff0000',
      themeId: 'abacus',
      createdTime: '2026-06-10T00:00:00.000Z',
      hidden: false,
      restrictions: { domainUsersOnly: true, driveMembersOnly: false },
    });
    expect(projected).toEqual({
      id: 'D1',
      name: 'Marketing',
      colorRgb: '#ff0000',
      themeId: 'abacus',
      createdTime: '2026-06-10T00:00:00.000Z',
      hidden: false,
      restrictions: { domainUsersOnly: true, driveMembersOnly: false },
    });
    expect(() => SharedDrive.parse(projected)).not.toThrow();
  });

  it('cleans an empty drive to the id sentinel', () => {
    const projected = projectSharedDrive({});
    expect(projected.id).toBe('');
    expect(projected.restrictions).toBeUndefined();
    expect(() => SharedDrive.parse(projected)).not.toThrow();
  });
});

describe('SHARED_DRIVE_FIELDS', () => {
  it('requests exactly what the projection consumes', () => {
    expect(SHARED_DRIVE_FIELDS).toContain('restrictions(');
    expect(SHARED_DRIVE_FIELDS).toContain('themeId');
  });
});
