const test = require('node:test');
const assert = require('node:assert/strict');
const {SOURCE_URL, fetchLawOfAtoMarkdown} = require('../glossary-source');

test('downloads the current Law of ATO as Markdown without changing its contents', async () => {
  const markdown = '# Rules {#a}\n\n1. **Example** Rule text.\n';
  const result = await fetchLawOfAtoMarkdown(async (url, options) => {
    assert.equal(url, SOURCE_URL);
    assert.match(url, /\/export\?format=md$/);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.signal.aborted, false);
    return {ok: true, text: async () => markdown};
  });

  assert.equal(result, markdown);
});

test('rejects a failed document export', async () => {
  await assert.rejects(fetchLawOfAtoMarkdown(async () => ({
    ok: false,
    status: 503,
  })), /HTTP 503/);
});

test('rejects an empty document export', async () => {
  await assert.rejects(fetchLawOfAtoMarkdown(async () => ({
    ok: true,
    text: async () => ' \n\t',
  })), /empty/);
});

test('rejects HTML such as a Google sign-in page', async () => {
  for (const html of ['<!DOCTYPE html><html>Sign in</html>', '\n<html>Sign in</html>']) {
    await assert.rejects(fetchLawOfAtoMarkdown(async () => ({
      ok: true,
      text: async () => html,
    })), /HTML instead of Markdown/);
  }
});

test('propagates network errors without returning document contents', async () => {
  const error = new Error('Network unavailable');
  await assert.rejects(fetchLawOfAtoMarkdown(async () => {
    throw error;
  }), error);
});
