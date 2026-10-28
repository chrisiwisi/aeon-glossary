const SOURCE_URL = 'https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/export?format=md';

async function fetchLawOfAtoMarkdown(fetchImpl = fetch) {
  const response = await fetchImpl(SOURCE_URL, {
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    throw new Error(`Law of ATO export returned HTTP ${response.status}`);
  }

  const markdown = await response.text();
  if (!markdown.trim() || /^\s*(?:<!doctype\s+html\b|<html\b)/i.test(markdown)) {
    throw new Error('Law of ATO export is empty or returned HTML instead of Markdown');
  }
  return markdown;
}

module.exports = {SOURCE_URL, fetchLawOfAtoMarkdown};
