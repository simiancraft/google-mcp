/**
 * Translate the MCP toolset's documented search-query vocabulary into Drive
 * REST v3 `q` syntax.
 *
 * The `search_files` page documents `query_term operator values` clauses with
 * three terms v3 spells differently: `title` is v3's `name`, and the
 * equality-shaped `parentId = 'x'` / `owner = 'me'` are v3's containment
 * clauses `'x' in parents` / `'me' in owners` (their `!=` forms negate with
 * `not`). Everything else the page documents (`fullText`, `mimeType`, the
 * timestamp terms, `sharedWithMe`, `and`/`or`/`not`, parentheses) is already
 * v3 vocabulary and passes through, as does anything undocumented (v3 rejects
 * what it rejects; inventing repairs would mask the error).
 *
 * Quoted string values are never rewritten: the input is tokenized before any
 * mapping, so a value like `'my title = x'` survives verbatim, including
 * `\'` escapes.
 *
 * @see https://developers.google.com/workspace/drive/api/reference/mcp/tools_list/search_files
 * @see https://developers.google.com/workspace/drive/api/guides/search-files
 */

type Token = {
  kind: 'value' | 'word' | 'op' | 'paren';
  text: string;
};

const OPERATOR_CHARS = new Set(['=', '!', '<', '>']);

/** Split a query into quoted values, words, comparison operators, and parentheses. */
export function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < query.length) {
    const char = query[i] as string;
    if (/\s/.test(char)) {
      i += 1;
    } else if (char === "'") {
      // A quoted value: consume through the closing quote, honoring \' escapes.
      // An unterminated quote takes the rest of the string; v3 will reject it.
      let end = i + 1;
      while (end < query.length && !(query[end] === "'" && query[end - 1] !== '\\')) {
        end += 1;
      }
      tokens.push({ kind: 'value', text: query.slice(i, Math.min(end + 1, query.length)) });
      i = end + 1;
    } else if (char === '(' || char === ')') {
      tokens.push({ kind: 'paren', text: char });
      i += 1;
    } else if (OPERATOR_CHARS.has(char)) {
      let end = i;
      while (end < query.length && OPERATOR_CHARS.has(query[end] as string)) {
        end += 1;
      }
      tokens.push({ kind: 'op', text: query.slice(i, end) });
      i = end;
    } else {
      let end = i;
      while (
        end < query.length &&
        !/\s/.test(query[end] as string) &&
        !OPERATOR_CHARS.has(query[end] as string) &&
        query[end] !== "'" &&
        query[end] !== '(' &&
        query[end] !== ')'
      ) {
        end += 1;
      }
      tokens.push({ kind: 'word', text: query.slice(i, end) });
      i = end;
    }
  }
  return tokens;
}

/** Terms whose v3 spelling is a plain rename. */
const RENAMED_TERMS: Record<string, string> = { title: 'name' };

/** Terms whose v3 spelling is a containment clause (`value in collection`). */
const CONTAINMENT_TERMS: Record<string, string> = { parentId: 'parents', owner: 'owners' };

/** Translate a documented MCP query into v3 `q` syntax (see module doc). */
export function translateQuery(query: string): string {
  const tokens = tokenize(query);
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i] as Token;
    if (token.kind === 'word') {
      const collection = CONTAINMENT_TERMS[token.text];
      const operator = tokens[i + 1];
      const value = tokens[i + 2];
      if (
        collection &&
        operator?.kind === 'op' &&
        (operator.text === '=' || operator.text === '!=') &&
        value?.kind === 'value'
      ) {
        if (operator.text === '!=') {
          out.push('not');
        }
        out.push(value.text, 'in', collection);
        i += 2;
        continue;
      }
      const renamed = RENAMED_TERMS[token.text];
      if (renamed) {
        out.push(renamed);
        continue;
      }
    }
    out.push(token.text);
  }
  return out.join(' ');
}
