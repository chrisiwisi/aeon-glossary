import json
import unittest
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from unittest.mock import Mock, patch

from glossary_source import SOURCE_URL, fetch_law_of_ato_rules, update_glossary_cache


class GlossarySourceTest(unittest.TestCase):
    @patch("glossary_source.urlopen")
    def test_fetches_and_converts_markdown_with_the_existing_converter(self, open_url):
        response = open_url.return_value.__enter__.return_value
        response.read.return_value = "# Rules {#a}\n\n1. **Élan** Rule text for Cycle IV.\n".encode("utf-8")

        self.assertEqual(fetch_law_of_ato_rules(), [{
            "id": "a.1",
            "name": "Élan",
            "rule": "Rule text for Cycle IV.",
            "keywords": ["Cycle IV", "a"],
        }])
        open_url.assert_called_once_with(SOURCE_URL, timeout=120)
        open_url.return_value.__exit__.assert_called_once()

    @patch("glossary_source.urlopen")
    def test_rejects_empty_and_html_exports(self, open_url):
        for content in [b" \n\t", b"<!DOCTYPE html><html>Sign in</html>", b"\n<html>Sign in</html>"]:
            with self.subTest(content=content):
                open_url.return_value.__enter__.return_value.read.return_value = content
                with self.assertRaisesRegex(ValueError, "empty or returned HTML"):
                    fetch_law_of_ato_rules()

    @patch("glossary_source.urlopen")
    def test_rejects_a_conversion_without_rules(self, open_url):
        open_url.return_value.__enter__.return_value.read.return_value = b"# Law of ATO\nNo numbered rules."

        with self.assertRaisesRegex(ValueError, "conversion returned no rules"):
            fetch_law_of_ato_rules()

    @patch("glossary_source.urlopen")
    def test_derives_chapter_ids_for_headings_without_anchors(self, open_url):
        open_url.return_value.__enter__.return_value.read.return_value = (
            b"6. ## **Battle Aftermath** {#battle-aftermath}\n\n"
            b"1. **Aftermath.** First rule.\n\n"
            b"7. ## **Bane Tokens**\n\n"
            b"1. **Ambrosia.** Second rule.\n\n"
            b"2. **Despair.** Third rule.\n\n"
            b"8. ## **Additional Battle Rules** {#additional-battle-rules}\n\n"
            b"1. **Other.** Fourth rule.\n"
        )

        rules = fetch_law_of_ato_rules()

        self.assertEqual([rule["id"] for rule in rules], [
            "battle-aftermath.1", "bane-tokens.1", "bane-tokens.2", "additional-battle-rules.1",
        ])
        self.assertEqual(rules[1]["keywords"], ["bane-tokens"])

    @patch("glossary_source.urlopen")
    def test_duplicate_rule_ids_do_not_replace_the_cache(self, open_url):
        open_url.return_value.__enter__.return_value.read.return_value = (
            b"# Rules {#rules}\n\n1. **First.** First rule.\n\n1. **Second.** Second rule.\n"
        )
        cache_ref = Mock()

        with self.assertRaisesRegex(ValueError, "duplicate rule IDs"):
            update_glossary_cache(cache_ref)
        cache_ref.set.assert_not_called()

    @patch("glossary_source.urlopen")
    def test_propagates_http_errors(self, open_url):
        open_url.side_effect = HTTPError(SOURCE_URL, 503, "Unavailable", None, None)

        with self.assertRaises(HTTPError):
            fetch_law_of_ato_rules()

    @patch("glossary_source.urlopen")
    def test_propagates_network_errors_and_timeouts(self, open_url):
        for error in [URLError("Network unavailable"), TimeoutError("Download timed out")]:
            with self.subTest(error=error):
                open_url.side_effect = error
                with self.assertRaises(type(error)):
                    fetch_law_of_ato_rules()

    @patch("glossary_source.urlopen")
    def test_fetches_converts_and_saves_rules_directly_to_the_cache(self, open_url):
        open_url.return_value.__enter__.return_value.read.return_value = (
            "# Rules {#a}\n\n1. **Élan** Rule text for Cycle IV.\n".encode("utf-8")
        )
        cache_ref = Mock()

        result = update_glossary_cache(cache_ref)

        cache_ref.set.assert_called_once()
        saved = cache_ref.set.call_args.args[0]
        self.assertEqual(json.loads(saved["rulesJson"]), [{
            "id": "a.1",
            "name": "Élan",
            "rule": "Rule text for Cycle IV.",
            "keywords": ["Cycle IV", "a"],
        }])
        self.assertEqual(saved["ruleCount"], 1)
        self.assertEqual(saved["sourceUrl"], SOURCE_URL)
        self.assertEqual(datetime.fromisoformat(saved["updatedAt"]).tzinfo, timezone.utc)
        self.assertEqual(result, {"ruleCount": 1, "updatedAt": saved["updatedAt"]})

    @patch("glossary_source.urlopen")
    def test_failed_or_invalid_exports_leave_the_existing_cache_untouched(self, open_url):
        cache_ref = Mock()
        for content in [b" ", b"<html>Sign in</html>", b"# No rules", b"\n1. **   ** Invalid name."]:
            with self.subTest(content=content):
                open_url.return_value.__enter__.return_value.read.return_value = content
                with self.assertRaises(ValueError):
                    update_glossary_cache(cache_ref)
                cache_ref.set.assert_not_called()

        for error in [HTTPError(SOURCE_URL, 503, "Unavailable", None, None), URLError("Offline"), TimeoutError()]:
            with self.subTest(error=error):
                open_url.side_effect = error
                with self.assertRaises(type(error)):
                    update_glossary_cache(cache_ref)
                cache_ref.set.assert_not_called()

    @patch("glossary_source.urlopen")
    def test_propagates_database_write_failures(self, open_url):
        open_url.return_value.__enter__.return_value.read.return_value = b"\n1. **Example** Rule text."
        cache_ref = Mock()
        cache_ref.set.side_effect = RuntimeError("Database unavailable")

        with self.assertRaisesRegex(RuntimeError, "Database unavailable"):
            update_glossary_cache(cache_ref)
        cache_ref.set.assert_called_once()

    @patch.dict("glossary_source.os.environ", {"FUNCTIONS_EMULATOR": "true"}, clear=True)
    @patch("glossary_source.urlopen")
    def test_local_sync_requires_the_database_emulator(self, open_url):
        cache_ref = Mock()

        with self.assertRaisesRegex(RuntimeError, "Realtime Database emulator"):
            update_glossary_cache(cache_ref)
        open_url.assert_not_called()
        cache_ref.set.assert_not_called()
