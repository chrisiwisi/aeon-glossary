import json
import os
import re
from datetime import datetime, timezone
from urllib.request import urlopen

from convertMarkdownToJson import extract_entries


SOURCE_URL = "https://docs.google.com/document/d/1u3q2ngOWhVvixLbz3PiR-4HG0A1OpcAzCM-9cveigu4/export?format=md"
CACHE_PATH = "glossaryCache"


def _is_rule(rule):
    return (
        isinstance(rule, dict)
        and all(isinstance(rule.get(field), str) and rule[field] for field in ("id", "name"))
        and isinstance(rule.get("rule"), str)
        and isinstance(rule.get("keywords"), list)
        and all(isinstance(keyword, str) for keyword in rule["keywords"])
    )


def fetch_law_of_ato_rules():
    with urlopen(SOURCE_URL, timeout=120) as response:
        markdown = response.read().decode("utf-8")

    if not markdown.strip() or re.match(r"\s*(?:<!doctype\s+html\b|<html\b)", markdown, re.IGNORECASE):
        raise ValueError("Law of ATO export is empty or returned HTML instead of Markdown")

    rules = extract_entries(markdown)
    if not rules:
        raise ValueError("Law of ATO conversion returned no rules")
    if not all(_is_rule(rule) for rule in rules):
        raise ValueError("Law of ATO conversion returned invalid rules")
    if len({rule["id"] for rule in rules}) != len(rules):
        raise ValueError("Law of ATO conversion returned duplicate rule IDs")
    return rules


def update_glossary_cache(cache_ref):
    if os.environ.get("FUNCTIONS_EMULATOR") == "true" and not os.environ.get("FIREBASE_DATABASE_EMULATOR_HOST"):
        raise RuntimeError("Start the Realtime Database emulator before syncing the glossary locally")

    rules = fetch_law_of_ato_rules()
    updated_at = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    cache_ref.set({
        "rulesJson": json.dumps(rules, ensure_ascii=False, separators=(",", ":")),
        "ruleCount": len(rules),
        "updatedAt": updated_at,
        "sourceUrl": SOURCE_URL,
    })
    return {"ruleCount": len(rules), "updatedAt": updated_at}
