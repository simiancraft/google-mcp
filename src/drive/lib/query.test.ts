import { describe, expect, it } from 'bun:test';
import { tokenize, translateQuery } from './query.js';

describe('tokenize', () => {
  it('splits words, operators, quoted values, and parentheses', () => {
    expect(tokenize("title contains 'taxes' and (mimeType != 'text/csv')")).toEqual([
      { kind: 'word', text: 'title' },
      { kind: 'word', text: 'contains' },
      { kind: 'value', text: "'taxes'" },
      { kind: 'word', text: 'and' },
      { kind: 'paren', text: '(' },
      { kind: 'word', text: 'mimeType' },
      { kind: 'op', text: '!=' },
      { kind: 'value', text: "'text/csv'" },
      { kind: 'paren', text: ')' },
    ]);
  });

  it('splits operators glued to their term and value', () => {
    expect(tokenize("title='x'")).toEqual([
      { kind: 'word', text: 'title' },
      { kind: 'op', text: '=' },
      { kind: 'value', text: "'x'" },
    ]);
  });

  it("honors \\' escapes inside quoted values", () => {
    expect(tokenize("fullText contains 'rock \\'n\\' roll'")).toEqual([
      { kind: 'word', text: 'fullText' },
      { kind: 'word', text: 'contains' },
      { kind: 'value', text: "'rock \\'n\\' roll'" },
    ]);
  });

  it('passes an unterminated quote through to the end of the string', () => {
    expect(tokenize("title contains 'oops")).toEqual([
      { kind: 'word', text: 'title' },
      { kind: 'word', text: 'contains' },
      { kind: 'value', text: "'oops" },
    ]);
  });
});

describe('translateQuery', () => {
  it('renames title to name, preserving the operator', () => {
    expect(translateQuery("title contains 'taxes'")).toBe("name contains 'taxes'");
    expect(translateQuery("title = 'Q2 plan'")).toBe("name = 'Q2 plan'");
    expect(translateQuery("title != 'draft'")).toBe("name != 'draft'");
  });

  it('rewrites parentId equality as parents containment', () => {
    expect(translateQuery("parentId = 'root'")).toBe("'root' in parents");
    expect(translateQuery("parentId != 'abc123'")).toBe("not 'abc123' in parents");
  });

  it('rewrites owner equality as owners containment', () => {
    expect(translateQuery("owner = 'me'")).toBe("'me' in owners");
    expect(translateQuery("owner != 'a@b.example'")).toBe("not 'a@b.example' in owners");
  });

  it('passes v3-native terms, booleans, and connectives through', () => {
    expect(
      translateQuery("fullText contains 'hello' and sharedWithMe = true or not starred = false"),
    ).toBe("fullText contains 'hello' and sharedWithMe = true or not starred = false");
    expect(translateQuery("modifiedTime > '2026-06-01T00:00:00'")).toBe(
      "modifiedTime > '2026-06-01T00:00:00'",
    );
  });

  it('translates inside parenthesized groups', () => {
    expect(translateQuery("(title contains 'a' or parentId = 'root') and owner = 'me'")).toBe(
      "( name contains 'a' or 'root' in parents ) and 'me' in owners",
    );
  });

  it('never rewrites term words inside quoted values', () => {
    expect(translateQuery("fullText contains 'title parentId = owner'")).toBe(
      "fullText contains 'title parentId = owner'",
    );
  });

  it('leaves undocumented operator shapes for v3 to reject', () => {
    expect(translateQuery("parentId contains 'root'")).toBe("parentId contains 'root'");
    expect(translateQuery('owner =')).toBe('owner =');
  });
});
