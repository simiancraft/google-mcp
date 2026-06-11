/**
 * The decoded-size ceiling for base64-in-JSON content transfers: 25 MiB,
 * Gmail's attachment maximum and the suite's de facto boundary for bytes that
 * must buffer whole into a JSON string. Drive's content tools and Gmail's
 * attachment download all enforce it; larger Drive transfers are deferred to
 * the media issue (#38).
 */
export const MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024;
