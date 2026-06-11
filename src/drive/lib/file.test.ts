import { describe, expect, it } from 'bun:test';
import { File } from '../entities/File.js';
import { Permission } from '../entities/Permission.js';
import { METHOD_FILE_FIELDS, projectFile, projectPermission, TOOL_FILE_FIELDS } from './file.js';

describe('projectFile', () => {
  it('maps the REST resource onto the toolset vocabulary', () => {
    const projected = projectFile({
      id: 'F1',
      name: 'Q2 plan',
      parents: ['P1'],
      mimeType: 'application/vnd.google-apps.document',
      size: '2048',
      description: 'planning doc',
      fileExtension: 'pdf',
      webViewLink: 'https://docs.google.com/document/d/F1/edit',
      sharedWithMeTime: '2026-06-01T00:00:00.000Z',
      createdTime: '2026-05-01T00:00:00.000Z',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      viewedByMeTime: '2026-06-09T00:00:00.000Z',
      owners: [{ emailAddress: 'a@b.example' }],
      capabilities: { canAddChildren: false },
      starred: true,
      trashed: false,
      folderColorRgb: '#ff0000',
      copyRequiresWriterPermission: true,
      writersCanShare: false,
    });
    expect(projected).toEqual({
      id: 'F1',
      title: 'Q2 plan',
      parentId: 'P1',
      mimeType: 'application/vnd.google-apps.document',
      fileSize: '2048',
      description: 'planning doc',
      fileExtension: 'pdf',
      viewUrl: 'https://docs.google.com/document/d/F1/edit',
      sharedWithMeTime: '2026-06-01T00:00:00.000Z',
      createdTime: '2026-05-01T00:00:00.000Z',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      viewedByMeTime: '2026-06-09T00:00:00.000Z',
      owner: 'a@b.example',
      canAddChildren: false,
      starred: true,
      trashed: false,
      folderColorRgb: '#ff0000',
      copyRequiresWriterPermission: true,
      writersCanShare: false,
    });
    expect(() => File.parse(projected)).not.toThrow();
  });

  it('cleans nulls and absences to undefined and falls back to the id sentinel', () => {
    const projected = projectFile({ name: null, parents: [] });
    expect(projected.id).toBe('');
    expect(projected.title).toBeUndefined();
    expect(projected.parentId).toBeUndefined();
    expect(projected.owner).toBeUndefined();
    expect(projected.canAddChildren).toBeUndefined();
    expect(projected.contentSnippet).toBeUndefined();
    expect(() => File.parse(projected)).not.toThrow();
  });

  it('requests exactly what the projections consume', () => {
    expect(TOOL_FILE_FIELDS).not.toContain('starred');
    expect(METHOD_FILE_FIELDS).toContain('starred');
    expect(METHOD_FILE_FIELDS).toContain(TOOL_FILE_FIELDS);
  });
});

describe('projectPermission', () => {
  it('projects the documented fields', () => {
    const projected = projectPermission({
      role: 'writer',
      displayName: 'Ada Lovelace',
      type: 'user',
      emailAddress: 'ada@b.example',
      view: 'published',
    });
    expect(projected).toEqual({
      role: 'writer',
      displayName: 'Ada Lovelace',
      type: 'user',
      emailAddress: 'ada@b.example',
      view: 'published',
    });
    expect(() => Permission.parse(projected)).not.toThrow();
  });

  it('drops unknown enum values rather than coercing them', () => {
    const projected = projectPermission({ role: 'somethingNew', type: 'robot', view: 'beta' });
    expect(projected.role).toBeUndefined();
    expect(projected.type).toBeUndefined();
    expect(projected.view).toBeUndefined();
    expect(() => Permission.parse(projected)).not.toThrow();
  });
});
