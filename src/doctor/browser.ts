import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

function isWsl(): boolean {
  if (process.env['WSL_DISTRO_NAME']) return true;
  try {
    return readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

/**
 * Open a URL in the host browser, including from inside WSL.
 *
 * On WSL, go through PowerShell's Start-Process rather than `cmd.exe /c start`:
 * an OAuth URL is full of `&`, and cmd.exe treats `&` as a command separator
 * (even quoted), truncating the URL at the first one. PowerShell is spawned
 * directly, so no shell re-tokenizes the URL, and the single-quoted argument
 * keeps every `&` intact. The consent URL is also printed by the auth flow, so a
 * failed open is never a dead end.
 */
export function openInBrowser(url: string): void {
  const wsl = isWsl();
  const cmd = wsl ? 'powershell.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args: string[] = wsl ? ['-NoProfile', '-Command', `Start-Process '${url}'`] : [url];
  try {
    const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
  } catch {
    // non-fatal; the URL is printed regardless.
  }
}
