import re
from urllib.request import urlopen

from convertMarkdownToJson import extract_entries


SOURCE_URL = "https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/export?format=md"


def fetch_law_of_ato_rules():
    with urlopen(SOURCE_URL, timeout=120) as response:
        markdown = response.read().decode("utf-8")

    if not markdown.strip() or re.match(r"\s*(?:<!doctype\s+html\b|<html\b)", markdown, re.IGNORECASE):
        raise ValueError("Law of ATO export is empty or returned HTML instead of Markdown")

    rules = extract_entries(markdown)
    if not rules:
        raise ValueError("Law of ATO conversion returned no rules")
    return rules
