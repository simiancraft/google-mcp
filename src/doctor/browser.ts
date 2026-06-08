import { type spawn as nodeSpawn, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

/** True when running under WSL (env hint, or a Microsoft kernel in /proc/version). */
export function detectWsl(
  env: NodeJS.ProcessEnv = process.env,
  readProcVersion: () => string = () => readFileSync('/proc/version', 'utf8'),
): boolean {
  if (env['WSL_DISTRO_NAME']) return true;
  try {
    return readProcVersion().toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

/**
 * The command to open a URL on each host. On WSL, go through PowerShell's
 * Start-Process rather than `cmd.exe /c start`: an OAuth URL is full of `&`, and
 * cmd.exe treats `&` as a command separator (even quoted), truncating the URL at
 * the first one. PowerShell is spawned directly, so no shell re-tokenizes it.
 */
export function browserCommand(
  url: string,
  wsl: boolean,
  platform: NodeJS.Platform,
): { cmd: string; args: string[] } {
  if (wsl) {
    return { cmd: 'powershell.exe', args: ['-NoProfile', '-Command', `Start-Process '${url}'`] };
  }
  if (platform === 'darwin') return { cmd: 'open', args: [url] };
  return { cmd: 'xdg-open', args: [url] };
}

export type OpenDeps = {
  spawn?: typeof nodeSpawn;
  wsl?: boolean;
  platform?: NodeJS.Platform;
};

/** Open a URL in the host browser. The consent URL is also printed by the auth
 * flow, so a failed open is never a dead end. */
export function openInBrowser(url: string, deps: OpenDeps = {}): void {
  const spawnFn = deps.spawn ?? spawn;
  const wsl = deps.wsl ?? detectWsl();
  const platform = deps.platform ?? process.platform;
  const { cmd, args } = browserCommand(url, wsl, platform);
  try {
    const child = spawnFn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
  } catch {
    // non-fatal.
  }
}
