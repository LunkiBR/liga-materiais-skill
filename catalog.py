"""Consulta pequena ao índice de playbooks gerado do Figma."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


BASE = Path(__file__).resolve().parent


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate(index: dict) -> dict:
    errors: list[str] = []
    seen: set[str] = set()
    total = 0
    for family, info in index["families"].items():
        path = BASE / info["detail"]
        if not path.is_file():
            errors.append(f"missing family file: {family}")
            continue
        data = read_json(path)
        items = data.get("templates", [])
        if data.get("family") != family or len(items) != info["count"]:
            errors.append(f"family mismatch: {family}")
        for item in items:
            if item["id"] in seen:
                errors.append(f"duplicate template ID: {item['id']}")
            seen.add(item["id"])
            if item.get("family") != family:
                errors.append(f"template in wrong family: {item['id']}")
            if not item.get("name", "").startswith("tpl-"):
                errors.append(f"non-catalog template: {item['id']}")
        total += len(items)
    if total != index["count"]["templates"]:
        errors.append(f"template count: {total}")
    if len(index["families"]) != index["count"]["families"]:
        errors.append("family count")
    for intent, route in index["intents"].items():
        for family in route["families"]:
            if family not in index["families"]:
                errors.append(f"missing family for {intent}: {family}")
    return {"ok": not errors, "errors": errors, "counts": index["count"]}


def fingerprint(index: dict) -> dict:
    items = [
        item
        for info in index["families"].values()
        for item in read_json(BASE / info["detail"])["templates"]
    ]
    payload = "\n".join(
        f"{item['id']}|{item['name']}|{item['width']}|{item['height']}|{item['child_count']}"
        for item in sorted(items, key=lambda value: value["id"])
    )
    value = 2166136261
    for character in payload:
        value = ((value ^ ord(character)) * 16777619) & 0xFFFFFFFF
    return {"count": len(items), "signature": f"{value:08x}"}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("intents")
    sub.add_parser("families")
    sub.add_parser("fingerprint")
    select = sub.add_parser("select")
    select.add_argument("intent")
    family = sub.add_parser("family")
    family.add_argument("name")
    search = sub.add_parser("search")
    search.add_argument("query")
    sub.add_parser("validate")
    args = parser.parse_args()
    index = read_json(BASE / "index.json")
    if args.command == "validate":
        result = validate(index)
    elif args.command == "fingerprint":
        result = fingerprint(index)
    elif args.command == "intents":
        result = list(index["intents"])
    elif args.command == "families":
        result = [{"name": name, "count": data["count"]} for name, data in index["families"].items()]
    elif args.command == "family":
        info = index["families"].get(args.name)
        if not info:
            parser.error(f"unknown family: {args.name}")
        result = read_json(BASE / info["detail"])
    elif args.command == "search":
        query = args.query.casefold()
        matches = [
            {"id": item["id"], "name": item["name"], "family": name}
            for name, info in index["families"].items()
            for item in read_json(BASE / info["detail"])["templates"]
            if query in name.casefold() or query in item["name"].casefold()
        ]
        result = {"total": len(matches), "items": matches[:10]}
    else:
        route = index["intents"].get(args.intent)
        if not route:
            parser.error(f"unknown intent: {args.intent}")
        families = route["families"]
        candidates = [
            {"id": item["id"], "name": item["name"], "family": name}
            for name in families
            for item in read_json(BASE / index["families"][name]["detail"])["templates"]
        ]
        result = {
            "intent": args.intent,
            "source_page": index["source"]["catalog_page"],
            "candidates": candidates,
        }
    print(json.dumps(result, ensure_ascii=False, separators=(",", ":")))
    if args.command == "validate" and not result["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
