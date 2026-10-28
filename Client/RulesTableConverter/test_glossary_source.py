import unittest
from urllib.error import HTTPError, URLError
from unittest.mock import patch

from glossary_source import SOURCE_URL, fetch_law_of_ato_rules


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
