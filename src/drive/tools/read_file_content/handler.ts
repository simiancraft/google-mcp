import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import {
  assertWithinCap,
  isGoogleNative,
  isTextLike,
  mediaBuffer,
  textExportMime,
} from '../../lib/content.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data: meta } = await drive.files.get({
    fileId: args.fileId,
    fields: 'id,mimeType,size',
    supportsAllDrives: true,
  });
  const mimeType = meta.mimeType ?? '';

  if (isGoogleNative(mimeType)) {
    const exportMime = textExportMime(mimeType);
    if (!exportMime) {
      throw new Error(
        `${mimeType} has no text representation; use download_file_content with an exportMimeType.`,
      );
    }
    const res = await drive.files.export(
      { fileId: args.fileId, mimeType: exportMime },
      { responseType: 'arraybuffer' },
    );
    // Native exports stay uncapped on purpose: Google's own export limit
    // (about 10 MB) sits under the suite ceiling (src/lib/consts.ts).
    return { fileContent: mediaBuffer(res).toString('utf8') };
  }

  if (!isTextLike(mimeType)) {
    throw new Error(
      `${mimeType || 'unknown mime type'} is not a text type this server can render; ` +
        'use download_file_content for base64 bytes.',
    );
  }
  // The same ceiling download_file_content enforces: blobs buffer whole into a
  // JSON string, so an uncapped read is a self-inflicted OOM on a large CSV.
  assertWithinCap(Number(meta.size ?? 0), 'File', 'content reads');
  const res = await drive.files.get(
    { fileId: args.fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' },
  );
  const bytes = mediaBuffer(res);
  // Re-check what actually arrived: the metadata size is a separate earlier
  // call, absent on some blobs, and content can change between the two.
  assertWithinCap(bytes.byteLength, 'File content', 'content reads');
  return { fileContent: bytes.toString('utf8') };
}
