import json
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def catalog(*args: str):
    completed = subprocess.run(
        [sys.executable, str(ROOT / "catalog.py"), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(completed.stdout)


class OriginalCatalogTests(unittest.TestCase):
    def test_local_index_is_consistent(self):
        result = catalog("validate")
        self.assertTrue(result["ok"])
        self.assertEqual(result["counts"], {"templates": 115, "families": 26})

    def test_cover_selection_returns_only_original_templates(self):
        result = catalog("select", "capa")
        self.assertEqual(result["source_page"], "198:2")
        self.assertEqual(
            [candidate["name"] for candidate in result["candidates"]],
            ["tpl-capa-v1", "tpl-capa-v2", "tpl-capa-v3", "tpl-capa-v4"],
        )
        self.assertNotIn("recipe", result)

    def test_every_intent_stays_within_catalog(self):
        for intent in catalog("intents"):
            with self.subTest(intent=intent):
                result = catalog("select", intent)
                self.assertTrue(result["candidates"])
                self.assertTrue(all(item["name"].startswith("tpl-") for item in result["candidates"]))


if __name__ == "__main__":
    unittest.main()
