#!/usr/bin/env python3
"""Export a PointTree inventory CSV as safe, static data for the GitHub Pages viewer.

The export intentionally omits absolute local paths and raw point-cloud payloads.
Use ``build_tree_viewer.py`` to additionally run PotreeConverter on a derived
LAS/LAZ product when a publishable point-cloud source is available.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _number(row: dict[str, str], *keys: str) -> float | None:
    for key in keys:
        try:
            value = row.get(key, "")
            if value not in ("", None):
                return float(value)
        except (TypeError, ValueError):
            continue
    return None


def _source_tile(row: dict[str, str]) -> str | None:
    value = row.get("source_tile") or row.get("source_file") or ""
    match = re.search(r"tile_[^/\\]+", value)
    return match.group(0) if match else None


def export_inventory(
    inventory: Path,
    output: Path,
    *,
    title: str,
    session: str,
    method: str | None = None,
    source_tile: str | None = None,
) -> dict[str, Any]:
    trees: list[dict[str, Any]] = []
    with inventory.open(newline="", encoding="utf-8-sig") as handle:
        for index, row in enumerate(csv.DictReader(handle)):
            tile = _source_tile(row)
            if source_tile and (not tile or source_tile not in tile):
                continue
            identifier = str(row.get("tree_id") or row.get("global_instance_id") or row.get("instance_id") or index)
            tree_method = method or row.get("method") or "PointTree"
            trees.append(
                {
                    "id": f"{session}:{identifier}",
                    "label": f"Tree {identifier}",
                    "session": session,
                    "method": tree_method,
                    "x": _number(row, "stem_x", "center_x", "x"),
                    "y": _number(row, "stem_y", "center_y", "y"),
                    "z": _number(row, "stem_z", "center_z", "z"),
                    "dbh_m": _number(row, "dbh", "stem_diameter", "diameter"),
                    "point_count": _number(row, "point_count", "instance_point_count"),
                    "structural_confidence": _number(row, "confidence_score", "structural_confidence", "dbh_confidence"),
                    "source_tile": tile,
                    "cloud_instance_id": _number(row, "local_instance_id", "instance_id"),
                }
            )
    payload = {
        "title": title,
        "session": session,
        "inventory_source": inventory.name,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "trees": trees,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inventory", type=Path, help="PointTree / inventory-oriented CSV")
    parser.add_argument("--output", type=Path, default=Path("web/data/tree_inventory.json"))
    parser.add_argument("--title", default="HKUST Campus Tree Survey")
    parser.add_argument("--session", default="HKUST-S20")
    parser.add_argument("--method", help="override method label")
    parser.add_argument("--source-tile", help="export only one tile, e.g. tile_x002_y003")
    args = parser.parse_args()
    result = export_inventory(
        args.inventory,
        args.output,
        title=args.title,
        session=args.session,
        method=args.method,
        source_tile=args.source_tile,
    )
    print(json.dumps({"output": str(args.output), "tree_count": len(result["trees"]), "title": result["title"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
