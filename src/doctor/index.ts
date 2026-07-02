#!/usr/bin/env node
import { errorMessage } from '../lib/utils/error.js';
/**
 * google-mcp-doctor: a micro-CLI for provisioning and auth health.
 *
 * Doctor knows the services; the services never know doctor. It imports the auth
 * layer and stable `@googleapis/*` surfaces only, never a service's internals.
 */
import { runAuth } from './auth.js';
import { diagnose, renderScopes } from './diagnose.js';
import { renderStatus } from './status.js';

function printHelp(write: (msg: string) => void = console.log): void {
  write(`google-mcp-doctor: provisioning & auth health for google-mcp-suite

Usage:
  google-mcp-doctor [check]          full diagnostic: provisioning, accounts, services
  google-mcp-doctor status           refresh-token countdown table
  google-mcp-doctor auth [<acct>…]   authorize accounts
                                       no args  → re-auth what is expired/due
                                       --all    → every account in the roster
                                       <acct>   → an email (no config needed) or roster label
  google-mcp-doctor scopes           the APIs + scopes to enable in Google Cloud
  google-mcp-doctor help

Flags:
  --no-probe   skip the live service health checks (offline/fast)`);
}

const [cmd = 'check', ...rest] = process.argv.slice(2);

try {
  switch (cmd) {
    case 'check':
    case 'diagnose':
      await diagnose({ probe: !rest.includes('--no-probe') });
      break;
    case 'status':
    case 'tokens':
      renderStatus();
      break;
    case 'auth':
      await runAuth(rest);
      break;
    case 'scopes':
      renderScopes();
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      printHelp(console.error);
      process.exit(1);
  }
} catch (err) {
  console.error(errorMessage(err));
  process.exit(1);
}
