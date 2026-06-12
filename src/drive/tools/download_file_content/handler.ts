import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { assertWithinDownloadCap } from '../../../lib/limits.js';
import { isGoogleNative, MEDIA_DEFERRAL, mediaBuffer } from '../../lib/content.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data: meta } = await drive.files.get({
    fileId: args.fileId,
    fields: 'id,name,mimeType,size',
    supportsAllDrives: true,
  });
  const mimeType = meta.mimeType ?? '';

  let bytes: Buffer;
  let contentMime = mimeType;
  if (isGoogleNative(mimeType)) {
    // Native exports stay uncapped on purpose: Google's own export limit
    // (about 10 MB) sits under the suite ceiling (src/lib/limits.ts).
    contentMime = args.exportMimeType ?? 'text/plain';
    const res = await drive.files.export(
      { fileId: args.fileId, mimeType: contentMime },
      { responseType: 'arraybuffer' },
    );
    bytes = mediaBuffer(res);
  } else {
    assertWithinDownloadCap(meta.size, {
      subject: 'File',
      action: 'base64 downloads',
      deferral: MEDIA_DEFERRAL,
    });
    const res = await drive.files.get(
      { fileId: args.fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' },
    );
    bytes = mediaBuffer(res);
    // Re-check what actually arrived: the metadata size is a separate earlier
    // call, absent on some blobs, and content can change between the two.
    assertWithinDownloadCap(bytes.byteLength, {
      subject: 'File content',
      action: 'base64 downloads',
      deferral: MEDIA_DEFERRAL,
    });
  }

  return {
    id: meta.id ?? args.fileId,
    title: meta.name ?? undefined,
    mimeType: contentMime || undefined,
    content: bytes.toString('base64'),
  };
}
