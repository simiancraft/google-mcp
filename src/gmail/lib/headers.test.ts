import { describe, expect, it } from 'bun:test';
import { headerParamSafe, headerSafe, stripBreaks } from './headers.js';

const DEL = String.fromCharCode(0x7f);

describe('headerSafe', () => {
  it('accepts a clean header value', () => {
    expect(headerSafe.safeParse('Jane Roe <jane@y.com>').success).toBe(true);
  });

  it('rejects line breaks and control characters', () => {
    expect(headerSafe.safeParse('a@b.com\r\nBcc: x@y.com').success).toBe(false);
    expect(headerSafe.safeParse(`a@b.com${DEL}`).success).toBe(false);
  });
});

describe('stripBreaks', () => {
  it('removes control characters and line breaks, keeping the rest', () => {
    expect(stripBreaks('a@b.com\r\nBcc: x')).toBe('a@b.comBcc: x');
    expect(stripBreaks('clean')).toBe('clean');
  });
});

describe('headerParamSafe', () => {
  it('strips control characters, quotes, and backslashes', () => {
    expect(headerParamSafe('re\r\nport".pdf\\')).toBe('report.pdf');
    expect(headerParamSafe('plain.txt')).toBe('plain.txt');
  });
});
