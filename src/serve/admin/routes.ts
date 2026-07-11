/**
 * Wires the admin routes onto the Express app. The page is one self-contained
 * HTML document (see `page.ts`); everything else is a small JSON API the page
 * talks to. The whole surface sits behind the Basic-auth gate, which is disabled
 * (503) unless `ADMIN_PASSWORD` is set.
 */
import { rmSync } from 'node:fs';
import type { Express } from 'express';
import { SCOPES } from '../../auth/config.js';
import { listAccounts } from './accounts.js';
import { loadClientKeys, saveClientSecret } from './clientSecret.js';
import { completeAuth, redirectUri, startAuth } from './oauth.js';
import { ADMIN_HTML } from './page.js';
import { googleMcpDir, tokenPath, validAccount } from './paths.js';
import { adminAuth, htmlEscape, resultPage } from './web.js';

export function mountAdmin(app: Express): void {
  app.get('/admin', adminAuth, (_req, res) => {
    res.type('html').send(ADMIN_HTML);
  });

  app.get('/admin/api/state', adminAuth, (_req, res) => {
    res.json({
      clientSecret: loadClientKeys() !== undefined,
      accounts: listAccounts(),
      scopes: SCOPES,
      dir: googleMcpDir(),
      redirectUri: redirectUri(),
    });
  });

  app.post('/admin/api/client-secret', adminAuth, (req, res) => {
    try {
      saveClientSecret(req.body?.content ?? req.body);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.post('/admin/api/auth/start', adminAuth, async (req, res) => {
    const account = String(req.body?.account ?? '').trim();
    if (!validAccount(account)) {
      res
        .status(400)
        .json({ error: 'Invalid account label: use letters, digits, and . _ % + @ -' });
      return;
    }
    try {
      const { authUrl } = await startAuth(account);
      res.json({ authUrl });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  // Manual (headless) completion: the user pastes the full redirected URL.
  app.post('/admin/api/auth/complete', adminAuth, async (req, res) => {
    try {
      const input = String(req.body?.url ?? '').trim();
      let state = String(req.body?.state ?? '').trim();
      let code = String(req.body?.code ?? '').trim();
      if (input) {
        const u = new URL(input);
        state = u.searchParams.get('state') ?? state;
        code = u.searchParams.get('code') ?? code;
      }
      if (!state || !code) throw new Error('Could not find state/code in the pasted value.');
      const account = await completeAuth(state, code);
      res.json({ ok: true, account });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  // Browser redirect target: auto-completes when the callback reaches us.
  app.get('/admin/oauth/callback', adminAuth, async (req, res) => {
    const state = String(req.query['state'] ?? '');
    const code = String(req.query['code'] ?? '');
    const error = String(req.query['error'] ?? '');
    if (error) {
      res
        .status(400)
        .type('html')
        .send(resultPage(`Authorization denied: ${htmlEscape(error)}`, false));
      return;
    }
    try {
      const account = await completeAuth(state, code);
      res
        .type('html')
        .send(resultPage(`Authorized ${htmlEscape(account)}. You can close this tab.`, true));
    } catch (err) {
      res
        .status(400)
        .type('html')
        .send(resultPage(htmlEscape((err as Error).message), false));
    }
  });

  app.delete('/admin/api/accounts/:account', adminAuth, (req, res) => {
    const account = String(req.params['account'] ?? '');
    if (!validAccount(account)) {
      res.status(400).json({ error: 'Invalid account label.' });
      return;
    }
    rmSync(tokenPath(account), { force: true });
    res.json({ ok: true });
  });
}
