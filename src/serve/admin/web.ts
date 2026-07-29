/** Shared HTTP helpers for the admin surface: the Basic-auth gate and small HTML pages. */
import type { NextFunction, Request, Response } from 'express';

/**
 * HTTP Basic gate for the whole admin surface. The UI manages OAuth secrets, so
 * it is disabled unless a password is configured: without `ADMIN_PASSWORD` every
 * `/admin` route returns 503 rather than running unauthenticated.
 */
export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const password = process.env['ADMIN_PASSWORD']?.trim();
  if (!password) {
    res
      .status(503)
      .type('text/plain')
      .send(
        'The /admin UI is disabled: set ADMIN_PASSWORD (and optionally ADMIN_USER) to enable it.',
      );
    return;
  }
  const user = process.env['ADMIN_USER']?.trim() || 'admin';
  const header = req.headers.authorization ?? '';
  if (header.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === password) {
      next();
      return;
    }
  }
  res
    .set('WWW-Authenticate', 'Basic realm="google-mcp admin"')
    .status(401)
    .send('Authentication required.');
}

export function htmlEscape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

/** Minimal result page shown after the browser OAuth redirect lands on us. */
export function resultPage(message: string, ok: boolean): string {
  return `<!doctype html><meta charset="utf-8"><title>OAuth</title>
<body style="font-family:system-ui;max-width:42rem;margin:4rem auto;padding:0 1rem">
<h1 style="color:${ok ? '#15803d' : '#b91c1c'}">${ok ? '✓' : '✗'} ${message}</h1>
<p><a href="/admin">Back to the admin UI</a></p></body>`;
}
