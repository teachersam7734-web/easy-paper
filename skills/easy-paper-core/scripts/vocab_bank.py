#!/usr/bin/env python3
"""Treasure Chest: append Vocab Treasure entries to a cumulative, deduplicated bank.

python3 vocab_bank.py <vocab-treasure.spec.json> --bank "<outputs>/Treasure Chest"

Writes/updates <bank>/treasure-chest.csv (one row per term) and <bank>/treasure-chest.md
(grouped by type, alphabetical). A term already banked keeps its first entry and gains the
new source in its 'also_in' column, so after 200 papers the chest shows how common each item is.
"""
import argparse, csv, json
from pathlib import Path

FIELDS = ["term", "type", "level", "meaning", "alternatives", "example", "context", "page", "source", "also_in", "note"]

def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("spec"); ap.add_argument("--bank", required=True)
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text(encoding="utf-8-sig"))
    meta = spec.get("meta", {}); paper = meta.get("paper", {})
    source = f"{paper.get('authors','?')} ({paper.get('year','?')})"
    def walk(bl):
        for b in bl or []:
            yield b; yield from walk(b.get("blocks"))
    items = [it for b in walk(spec.get("blocks")) if b.get("type") == "vocab" for it in b.get("items", [])]
    bank = Path(a.bank); bank.mkdir(parents=True, exist_ok=True)
    csv_path = bank / "treasure-chest.csv"
    rows = {}
    if csv_path.exists():
        with open(csv_path, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                rows[r["term"].lower()] = r
    added = 0
    for it in items:
        k = it.get("term", "").lower()
        if not k:
            continue
        if k in rows:
            also = [x for x in rows[k].get("also_in", "").split("; ") if x]
            if source not in also and source != rows[k]["source"]:
                rows[k]["also_in"] = "; ".join(also + [source])
            continue
        rows[k] = {"term": it.get("term"), "type": it.get("type", ""), "level": it.get("level", ""),
                   "meaning": it.get("meaning", ""), "alternatives": "; ".join(it.get("alternatives", [])),
                   "example": it.get("example", "").replace("**", ""), "context": it.get("context", ""),
                   "page": it.get("page", ""), "source": source, "also_in": "", "note": it.get("note", "")}
        added += 1
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader()
        for r in sorted(rows.values(), key=lambda r: r["term"].lower()):
            w.writerow({k: r.get(k, "") for k in FIELDS})
    by_type = {}
    for r in rows.values():
        by_type.setdefault(r["type"] or "other", []).append(r)
    md = [f"# Treasure Chest\n\n{len(rows)} items from Vocab Treasure reels.\n"]
    for t in sorted(by_type):
        md.append(f"\n## {t} ({len(by_type[t])})\n\n| Term | Level | Meaning | Alternatives | Source |\n|---|---|---|---|---|")
        for r in sorted(by_type[t], key=lambda r: r["term"].lower()):
            src = r["source"] + (f"; {r['also_in']}" if r.get("also_in") else "")
            md.append(f"| **{r['term']}** | {r['level']} | {r['meaning']} | {r['alternatives']} | {src} |")
    (bank / "treasure-chest.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"Treasure Chest: +{added} new, {len(rows)} total -> {csv_path}")

if __name__ == "__main__":
    main()
