import { describe, expect, it, mock } from 'bun:test';
import type { ChildProcess, spawn } from 'node:child_process';
import { browserCommand, detectWsl, openInBrowser } from './browser.js';

describe('detectWsl', () => {
  it('is true via WSL_DISTRO_NAME', () => {
    expect(detectWsl({ WSL_DISTRO_NAME: 'Ubuntu' } as NodeJS.ProcessEnv, () => '')).toBe(true);
  });

  it('is true when /proc/version names a Microsoft kernel', () => {
    expect(detectWsl({} as NodeJS.ProcessEnv, () => 'Linux 5.15 Microsoft-standard')).toBe(true);
  });

  it('is false on a plain kernel', () => {
    expect(detectWsl({} as NodeJS.ProcessEnv, () => 'Linux 6.6 generic')).toBe(false);
  });

  it('is false when /proc/version is unreadable', () => {
    expect(
      detectWsl({} as NodeJS.ProcessEnv, () => {
        throw new Error('nope');
      }),
    ).toBe(false);
  });

  it('reads the real environment with its defaults', () => {
    const savedWsl = process.env['WSL_DISTRO_NAME'];
    delete process.env['WSL_DISTRO_NAME'];
    try {
      expect(typeof detectWsl()).toBe('boolean');
    } finally {
      if (savedWsl === undefined) delete process.env['WSL_DISTRO_NAME'];
      else process.env['WSL_DISTRO_NAME'] = savedWsl;
    }
  });
});

describe('browserCommand', () => {
  it('uses PowerShell Start-Process on WSL, preserving &', () => {
    expect(browserCommand('http://x?a=1&b=2', true, 'linux')).toEqual({
      cmd: 'powershell.exe',
      args: ['-NoProfile', '-Command', "Start-Process 'http://x?a=1&b=2'"],
    });
  });

  it('uses open on macOS', () => {
    expect(browserCommand('u', false, 'darwin')).toEqual({ cmd: 'open', args: ['u'] });
  });

  it('uses xdg-open on Linux', () => {
    expect(browserCommand('u', false, 'linux')).toEqual({ cmd: 'xdg-open', args: ['u'] });
  });
});

describe('openInBrowser', () => {
  it('spawns the command, wires the error handler, and unrefs', () => {
    let onError: (() => void) | undefined;
    let unrefed = false;
    const child = {
      on(event: string, cb: () => void) {
        if (event === 'error') onError = cb;
        return child;
      },
      unref() {
        unrefed = true;
      },
    } as unknown as ChildProcess;
    const spawnFn = mock(() => child);
    openInBrowser('http://x', {
      spawn: spawnFn as unknown as typeof spawn,
      wsl: false,
      platform: 'linux',
    });
    expect(spawnFn).toHaveBeenCalled();
    expect(unrefed).toBe(true);
    onError?.();
  });

  it('swallows a spawn failure', () => {
    const spawnFn = mock(() => {
      throw new Error('no binary');
    });
    expect(() =>
      openInBrowser('http://x', {
        spawn: spawnFn as unknown as typeof spawn,
        wsl: false,
        platform: 'linux',
      }),
    ).not.toThrow();
  });
});
