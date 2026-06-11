/**
 * The content boundary for the two content tools (see the COVERAGE.md
 * divergence notes): Google-native files cross it through `files.export`,
 * blobs through `files.get alt=media`, and everything is JSON on the wire,
 * so bytes travel base64 and oversized transfers are refused rather than
 * degraded (EXTENDING.md, "Output crosses the wire as JSON").
 */

/**
 * Google Workspace editor types and the export MIME backing their
 * "natural language representation" (`read_file_content`); other native types
 * (forms, sites, maps, shortcuts) have no text export and are refused.
 */
const TEXT_EXPORTS: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
  'application/vnd.google-apps.presentation': 'text/plain',
};

/** Whether the type is a Google Workspace native type (exported, never downloaded). */
export function isGoogleNative(mimeType: string): boolean {
  return mimeType.startsWith('application/vnd.google-apps.');
}

/** The text-representation export MIME for a native type, if it has one. */
export function textExportMime(mimeType: string): string | undefined {
  return TEXT_EXPORTS[mimeType];
}

/** Whether a blob type is text enough for `read_file_content` to return as UTF-8. */
export function isTextLike(mimeType: string): boolean {
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType === 'application/xml' ||
    mimeType === 'image/svg+xml' ||
    mimeType.endsWith('+json') ||
    mimeType.endsWith('+xml')
  );
}

/**
 * The bytes of a media-shaped response. googleapis types `res.data` from the
 * resource schema, not the request's `responseType`; with
 * `{ responseType: 'arraybuffer' }` the body is an ArrayBuffer at runtime,
 * and this helper owns that one cast for both content tools.
 */
export function mediaBuffer(res: { data: unknown }): Buffer {
  return Buffer.from(res.data as ArrayBuffer);
}
