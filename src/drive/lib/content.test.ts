import { describe, expect, it } from 'bun:test';
import { MAX_DOWNLOAD_BYTES } from '../../lib/consts.js';
import { isGoogleNative, isTextLike, mediaBuffer, textExportMime } from './content.js';

describe('isGoogleNative', () => {
  it('recognizes Workspace editor and other native types', () => {
    expect(isGoogleNative('application/vnd.google-apps.document')).toBe(true);
    expect(isGoogleNative('application/vnd.google-apps.folder')).toBe(true);
    expect(isGoogleNative('application/pdf')).toBe(false);
    expect(isGoogleNative('text/plain')).toBe(false);
  });
});

describe('textExportMime', () => {
  it('maps the three editor types onto their text representations', () => {
    expect(textExportMime('application/vnd.google-apps.document')).toBe('text/plain');
    expect(textExportMime('application/vnd.google-apps.spreadsheet')).toBe('text/csv');
    expect(textExportMime('application/vnd.google-apps.presentation')).toBe('text/plain');
  });

  it('has no representation for non-exportable native types', () => {
    expect(textExportMime('application/vnd.google-apps.folder')).toBeUndefined();
    expect(textExportMime('application/vnd.google-apps.shortcut')).toBeUndefined();
  });
});

describe('isTextLike', () => {
  it('accepts text, JSON, XML, and SVG blob types', () => {
    expect(isTextLike('text/plain')).toBe(true);
    expect(isTextLike('text/markdown')).toBe(true);
    expect(isTextLike('application/json')).toBe(true);
    expect(isTextLike('application/xml')).toBe(true);
    expect(isTextLike('image/svg+xml')).toBe(true);
    expect(isTextLike('application/ld+json')).toBe(true);
  });

  it('rejects binary types', () => {
    expect(isTextLike('application/pdf')).toBe(false);
    expect(isTextLike('image/png')).toBe(false);
    expect(
      isTextLike('application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    ).toBe(false);
  });
});

describe('mediaBuffer', () => {
  it('returns the arraybuffer body as a Buffer', () => {
    const bytes = new TextEncoder().encode('media body');
    expect(mediaBuffer({ data: bytes.buffer }).toString('utf8')).toBe('media body');
  });
});

describe('MAX_DOWNLOAD_BYTES', () => {
  it('is the 25 MiB base64 boundary', () => {
    expect(MAX_DOWNLOAD_BYTES).toBe(26214400);
  });
});
