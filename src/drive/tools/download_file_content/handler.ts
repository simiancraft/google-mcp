import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { MAX_DOWNLOAD_BYTES } from '../../../lib/limits.js';
import { isGoogleNative, mediaBuffer } from '../../lib/content.js';
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
    contentMime = args.exportMimeType ?? 'text/plain';
    const res = await drive.files.export(
      { fileId: args.fileId, mimeType: contentMime },
      { responseType: 'arraybuffer' },
    );
    bytes = mediaBuffer(res);
  } else {
    const size = Number(meta.size ?? 0);
    if (size > MAX_DOWNLOAD_BYTES) {
      throw new Error(
        `File is ${size} bytes; this server caps base64 downloads at ${MAX_DOWNLOAD_BYTES} bytes ` +
          '(25 MiB). Larger transfers are deferred to ' +
          'https://github.com/simiancraft/google-mcp-suite/issues/38.',
      );
    }
    const res = await drive.files.get(
      { fileId: args.fileId, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' },
    );
    bytes = mediaBuffer(res);
    // Re-check what actually arrived: the metadata size is a separate earlier
    // call, absent on some blobs, and content can change between the two.
    if (bytes.byteLength > MAX_DOWNLOAD_BYTES) {
      throw new Error(
        `File content is ${bytes.byteLength} bytes; this server caps base64 downloads at ` +
          `${MAX_DOWNLOAD_BYTES} bytes (25 MiB). Larger transfers are deferred to ` +
          'https://github.com/simiancraft/google-mcp-suite/issues/38.',
      );
    }
  }

  return {
    id: meta.id ?? args.fileId,
    title: meta.name ?? undefined,
    mimeType: contentMime || undefined,
    content: bytes.toString('base64'),
  };
}
