import { describe, expect, it } from 'bun:test';
import { Comment } from '../entities/Comment.js';
import { Reply } from '../entities/Reply.js';
import {
  COMMENT_FIELDS,
  projectComment,
  projectReply,
  projectUser,
  REPLY_FIELDS,
} from './comment.js';

describe('projectUser', () => {
  it('projects the documented fields and cleans nulls', () => {
    expect(projectUser({ displayName: 'Ada', me: true, emailAddress: null })).toEqual({
      displayName: 'Ada',
      me: true,
    });
  });
});

describe('projectReply', () => {
  it('projects a reply with its author and action', () => {
    const projected = projectReply({
      id: 'R1',
      content: 'looks good',
      htmlContent: '<p>looks good</p>',
      author: { displayName: 'Ada', me: false },
      createdTime: '2026-06-10T00:00:00.000Z',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      action: 'resolve',
    });
    expect(projected).toEqual({
      id: 'R1',
      content: 'looks good',
      htmlContent: '<p>looks good</p>',
      author: { displayName: 'Ada', me: false },
      createdTime: '2026-06-10T00:00:00.000Z',
      modifiedTime: '2026-06-10T00:00:00.000Z',
      action: 'resolve',
    });
    expect(() => Reply.parse(projected)).not.toThrow();
  });

  it('drops unknown actions and falls back to the id sentinel', () => {
    const projected = projectReply({ action: 'escalate' });
    expect(projected.id).toBe('');
    expect(projected.action).toBeUndefined();
    expect(() => Reply.parse(projected)).not.toThrow();
  });
});

describe('projectComment', () => {
  it('projects a comment with its quoted content and reply thread', () => {
    const projected = projectComment({
      id: 'C1',
      content: 'typo here',
      resolved: false,
      anchor: '{"r":"head"}',
      quotedFileContent: { mimeType: 'text/plain', value: 'teh' },
      replies: [{ id: 'R1', content: 'fixed', action: 'resolve' }],
    });
    expect(projected).toEqual({
      id: 'C1',
      content: 'typo here',
      resolved: false,
      anchor: '{"r":"head"}',
      quotedFileContent: { mimeType: 'text/plain', value: 'teh' },
      replies: [{ id: 'R1', content: 'fixed', action: 'resolve' }],
    });
    expect(() => Comment.parse(projected)).not.toThrow();
  });

  it('cleans an empty comment to the id sentinel', () => {
    const projected = projectComment({});
    expect(projected.id).toBe('');
    expect(projected.replies).toBeUndefined();
    expect(projected.quotedFileContent).toBeUndefined();
    expect(() => Comment.parse(projected)).not.toThrow();
  });
});

describe('fields selections', () => {
  it('request exactly what the projections consume', () => {
    expect(COMMENT_FIELDS).toContain(`replies(${REPLY_FIELDS})`);
    expect(REPLY_FIELDS).toContain('action');
    expect(COMMENT_FIELDS).toContain('quotedFileContent(mimeType,value)');
  });
});
