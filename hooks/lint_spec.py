#!/usr/bin/env python3
"""PostToolUse hook for Easy Paper.

- An Easy Paper spec (*.spec.json whose meta.mode is deep-dive, critique or review-guide) is
  validated with the rules of its mode (scripts/validate.py). Problems go back to Claude
  (stderr + exit 2).
- A file named deep-dive/critique/review-guide.spec.json without a valid meta.mode is flagged.
- Persona files (analyst*.md, scout.md, judge.md, coach.md, distiller.md, quiz.md) inside an
  Easy Paper workspace (a folder holding paper.txt) are checked for em/en dashes and
  exclamation marks.
Everything else, including other projects' *.spec.json files, is ignored (exit 0).
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "skills" / "easy-paper-core" / "scripts"))
from validate import MODES
NAMED = {f"{m}.spec.json" for m in MODES}
PERSONA_FILES = {"analyst.md", "analyst-deep-dive.md", "analyst-critique.md", "scout.md",
                 "judge.md", "coach.md", "distiller.md", "quiz.md"}

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    ti = data.get("tool_input") or {}
    fp = ti.get("file_path") or ti.get("path") or ""
    if not fp:
        return 0
    p = Path(fp)
    if not p.exists():
        return 0
    if p.name.endswith(".spec.json"):
        try:
            spec = json.loads(p.read_text(encoding="utf-8-sig"))
        except Exception as e:
            if p.name in NAMED:
                print(f"Easy Paper: {p.name} is not valid JSON: {e}", file=sys.stderr)
                return 2
            return 0
        meta = spec.get("meta") if isinstance(spec, dict) else None
        mode = meta.get("mode") if isinstance(meta, dict) else None
        if mode not in MODES:
            if p.name in NAMED:
                print(f"Easy Paper: {p.name} needs meta.mode set to one of {', '.join(MODES)}.", file=sys.stderr)
                return 2
            return 0   # not an Easy Paper spec
        import validate
        probs = validate.validate(spec, mode)
        if probs:
            print(f"Easy Paper [{mode}] spec check: {len(probs)} problem(s) in {p.name}:", file=sys.stderr)
            for x in probs[:40]:
                print(" - " + x, file=sys.stderr)
            print("Fix these, then render (render.py runs the same checks plus the layout check).", file=sys.stderr)
            return 2
        return 0
    if p.name in PERSONA_FILES and (p.parent / "paper.txt").exists():
        txt = p.read_text(encoding="utf-8-sig")
        dashes = len(re.findall(r"[—–]", txt))
        bangs = len(re.findall(r"\w!(\s|$)", txt))
        if dashes or bangs:
            print(f"Easy Paper: {p.name} has {dashes} em/en dash(es) and {bangs} exclamation mark(s). "
                  "Use commas, colons, parentheses or hyphens; drop exclamation marks.", file=sys.stderr)
            return 2
    return 0

if __name__ == "__main__":
    sys.exit(main())
