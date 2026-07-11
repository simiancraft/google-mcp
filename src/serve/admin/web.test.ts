import { expect, it } from 'bun:test';
import { htmlEscape, resultPage } from './web.js';

it('htmlEscape neutralizes every HTML-significant character', () => {
  expect(htmlEscape(`<a href="x" title='y'>&</a>`)).toBe(
    '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
  );
});

it('htmlEscape leaves ordinary text untouched', () => {
  expect(htmlEscape('you@example.com')).toBe('you@example.com');
});

it('resultPage renders a success page in green with the message', () => {
  const html = resultPage('Authorized you@example.com.', true);
  expect(html).toContain('#15803d');
  expect(html).toContain('✓ Authorized you@example.com.');
  expect(html).toContain('Back to the admin UI');
});

it('resultPage renders a failure page in red', () => {
  const html = resultPage('It broke.', false);
  expect(html).toContain('#b91c1c');
  expect(html).toContain('✗ It broke.');
});
