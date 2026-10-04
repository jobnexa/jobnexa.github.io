import assert from 'node:assert/strict';
import test from 'node:test';
import { newsletterFormAction } from '../../src/lib/newsletter.ts';

test('missing provider stays disconnected without a fallback address', () => {
  assert.equal(newsletterFormAction(undefined), '');
  assert.equal(newsletterFormAction('  '), '');
});

test('a public HTTPS provider form can be configured', () => {
  assert.equal(newsletterFormAction(' https://formspree.io/f/public-form '), 'https://formspree.io/f/public-form');
});

test('signup endpoint rejects plaintext, scripts, embedded credentials and fragments', () => {
  for (const value of ['http://example.com/form', 'javascript:alert(1)', '/subscribe', 'https:example.com/form', 'https:/example.com/form', 'https://example.com\\form', 'https://exam\nple.com/form', 'https://user:secret@example.com/form', 'https://example.com/form#secret']) {
    assert.throws(() => newsletterFormAction(value));
  }
});
