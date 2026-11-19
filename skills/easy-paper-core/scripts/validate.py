#!/usr/bin/env python3
"""Validate an Easy Paper content spec before (and during) rendering.

python3 validate.py spec.json [--mode deep-dive|critique|review-guide]

Checks: required blocks and counts per mode (the LIMITS table below is the single
source of truth that the layout templates cite), ADHD furniture (preview, nuggets,
hunt-question chunks, quiz with answers), writing rules (no em/en dashes, no
exclamation marks, AI-tell words) on authored text, unfilled <placeholders>,
verbatim definitions carry a page, and word limits that keep chunks digestible.
Verbatim quotes, reference lists and meta.paper keep their original punctuation.
Returns a list of problem strings.
"""
import json, re, sys
from pathlib import Path

MODES = ("deep-dive", "critique", "review-guide", "vocab-treasure")
DASH = re.compile(r"[—–]")
PLACEHOLDER = re.compile(r"<[^<>\n]{1,60}>")
RED_LIST = ["delve", "tapestry", "testament to", "in today's fast-paced", "navigate the complexities",
            "it is important to note", "unlock", "game-changer", "seamless", "embark", "realm", "furthermore,",
            "moreover,", "in conclusion,", "a myriad of", "pivotal", "intricate", "multifaceted", "underscore"]

# Single source of truth for counts (cited by every layout-template.md).
LIMITS = {
    "deep-dive":    {"qa": (5, 6), "preview": (5, 6), "quiz": (10, 12), "nuggets": (5, 7), "chunk": (5, 8), "definition_max": 4,
                     "required": ["mission", "preview", "nuggets", "glossary", "qa", "script", "quiz", "sources"]},
    "critique":     {"qa": (4, 6), "preview": (4, 5), "quiz": (8, 10), "nuggets": (4, 5), "chunk": (3, 4), "strength": (3, 4),
                     "weakness": (3, 5), "required": ["verdict", "preview", "nuggets", "script", "qa", "quiz"]},
    "review-guide": {"qa": (4, 5), "preview": (4, 4), "quiz": (8, 8), "nuggets": (3, 5), "definition_max": 5, "branches": (5, 7),
                     "leaves": (2, 4), "leaf_words": 8, "plan_minutes": 120,
                     "required": ["preview", "mindmap", "nuggets", "studyplan", "qa", "quiz"]},
    "vocab-treasure": {"entries": (7, 22), "quiz": (2, 3), "required": ["vt_strip", "vocab"]},
}
SAY_MAX, CLAIM_MAX, VERDICT_MAX, ANSWER_MAX, PARA_MAX = 25, 30, 25, 45, 95

def words(s):
    return len(re.findall(r"\w+", s or ""))

def strings(node, path, skip):
    """Yield (path, str) for every string, skipping verbatim/reference subtrees."""
    if isinstance(node, dict):
        t = node.get("type")
        for k, v in node.items():
            p = f"{path}.{k}"
            if k in ("type", "icon", "color", "tone", "kind", "style", "direction", "src", "svg", "id", "mode", "cover"):
                continue
            if (t == "definition" and k == "quote") or (t == "quote" and k == "text") or (t == "sources" and k == "items") or k == "context":
                skip_this = True
            else:
                skip_this = False
            if isinstance(v, str):
                yield p, v, skip_this or skip
            else:
                yield from strings(v, p, skip_this or skip)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            if isinstance(v, str):
                yield f"{path}[{i}]", v, skip
            else:
                yield from strings(v, f"{path}[{i}]", skip)

def all_blocks(blocks):
    for b in blocks or []:
        if not isinstance(b, dict):
            continue
        yield b
        yield from all_blocks(b.get("blocks"))
        if isinstance(b.get("cols"), list):
            for col in b["cols"]:
                yield from all_blocks(col)
        if b.get("type") == "cards":
            for it in b.get("items", []):
                if isinstance(it, dict):
                    yield from all_blocks(it.get("blocks"))

def rng(P, label, n, lo_hi):
    lo, hi = lo_hi
    if not (lo <= n <= hi):
        P.append(f"{label}: has {n}, needs {lo}" + ("" if lo == hi else f" to {hi}"))

def validate(spec, mode=None):
    P = []
    if not isinstance(spec, dict):
        return ["Spec must be a JSON object with 'meta' and 'blocks'"]
    meta = spec.get("meta", {}) or {}
    mode = mode or meta.get("mode")
    if mode not in MODES:
        return [f"meta.mode must be one of {', '.join(MODES)} (got {mode!r})"]
    L = LIMITS[mode]
    skeleton = bool(meta.get("skeleton"))
    blocks = spec.get("blocks", [])
    flat = list(all_blocks(blocks))
    count = lambda t: sum(1 for b in flat if b.get("type") == t)
    first = lambda t: next((b for b in flat if b.get("type") == t), None)

    paper = meta.get("paper", {}) or {}
    for k in ("title", "reference"):
        if not paper.get(k):
            P.append(f"meta.paper.{k} is missing")

    # ---- required blocks and counts
    for t in L["required"]:
        if not count(t):
            P.append(f"{mode} needs a '{t}' block")
    pv = first("preview")
    if pv and "preview" in L:
        rng(P, "Preview questions", len(pv.get("items", [])), L["preview"])
    for q in [b for b in flat if b.get("type") == "quiz"]:
        rng(P, "Quiz items", len(q.get("items", [])), L["quiz"])
        for i, it in enumerate(q.get("items", []), 1):
            if not it.get("answer"):
                P.append(f"Quiz Q{i} has no answer")
            if it.get("type", "mcq") == "mcq" and len(it.get("options", [])) < 3:
                P.append(f"Quiz Q{i} is mcq but has fewer than 3 options")
            if not re.search(r"\[(PDF )?(pp?\.|Table|Fig|Note)", it.get("why", "")):
                P.append(f"Quiz Q{i}: 'why' needs a page anchor like [p. 12]")
    if "qa" in L:
        nqa = sum(len(b.get("items", [])) for b in flat if b.get("type") == "qa")
        rng(P, "Q&A items (likely questions with model answers)", nqa, L["qa"])
    ng = first("nuggets")
    if ng and "nuggets" in L:
        rng(P, "Gold nuggets", len(ng.get("items", [])), L["nuggets"])
    if "chunk" in L:
        rng(P, "Hunt-question chunks", count("chunk"), L["chunk"])
    if "definition_max" in L:
        nd = sum(1 for b in flat if b.get("type") == "definition" and b.get("quote") and b.get("verbatim", True))
        if nd > L["definition_max"]:
            P.append(f"{nd} verbatim definitions; at most {L['definition_max']} in {mode}")

    # ---- per-block rules
    for b in flat:
        t = b.get("type")
        if t == "chunk":
            cid = b.get("id", "?")
            if not b.get("question", "").strip().endswith("?"):
                P.append(f"Chunk {cid}: hunt question must end with '?'")
            if not b.get("answer"):
                P.append(f"Chunk {cid}: needs a short answer")
            elif words(b["answer"]) > ANSWER_MAX:
                P.append(f"Chunk {cid}: short answer is {words(b['answer'])} words (max {ANSWER_MAX})")
        elif t == "p" and words(b.get("text")) > PARA_MAX:
            P.append(f"Paragraph of {words(b.get('text'))} words; split it or use bullets (max {PARA_MAX})")
        elif t == "definition" and b.get("quote") and b.get("verbatim", True):
            if not re.search(r"p\.\s?\d", b.get("source", "")):
                P.append(f"Verbatim definition '{b.get('term')}' needs a page number in source")
        elif t == "critique_card":
            ttl = b.get("title", "?")
            for k in ("claim", "anchor", "why", "say"):
                if not b.get(k):
                    P.append(f"critique_card '{ttl}' missing '{k}'")
            if words(b.get("say")) > SAY_MAX:
                P.append(f"critique_card '{ttl}': say-it line is {words(b.get('say'))} words (max {SAY_MAX})")
            if words(b.get("claim")) > CLAIM_MAX:
                P.append(f"critique_card '{ttl}': claim is {words(b.get('claim'))} words (max {CLAIM_MAX})")
            if not re.search(r"\[(PDF )?(pp?\.|Table|Fig|Note)", b.get("anchor", "")):
                P.append(f"critique_card '{ttl}': anchor needs a page anchor like [p. 12]")
            if b.get("kind") == "weakness":
                if not b.get("fix"):
                    P.append(f"weakness '{ttl}' needs a 'fix' (remedy or remove)")
                if b.get("severity") not in ("major", "moderate", "minor"):
                    P.append(f"weakness '{ttl}' needs severity major / moderate / minor")
        elif t == "verdict":
            if words(b.get("line")) > VERDICT_MAX:
                P.append(f"Verdict line is {words(b.get('line'))} words (max {VERDICT_MAX})")
            sc = b.get("scores", [])
            if len(sc) != 5:
                P.append(f"Verdict needs exactly 5 ratings (has {len(sc)})")
            vals = [s.get("value") for s in sc]
            if any(not isinstance(v, int) or not 1 <= v <= 5 for v in vals):
                P.append("Verdict ratings must be whole numbers 1 to 5")
            elif vals and all(v == 5 for v in vals):
                P.append("Verdict ratings cannot all be 5")
        elif t == "mindmap" and mode == "review-guide":
            br = b.get("branches", [])
            rng(P, "Mind-map branches", len(br), L["branches"])
            for i, x in enumerate(br, 1):
                rng(P, f"Mind-map branch {i} leaves", len(x.get("leaves", [])), L["leaves"])
                for leaf in x.get("leaves", []):
                    if words(re.sub(r"\[[^\]]*\]", "", leaf)) > L["leaf_words"]:
                        P.append(f"Mind-map leaf too long (max {L['leaf_words']} words): '{leaf[:50]}'")
        elif t == "studyplan" and mode == "review-guide":
            tot = sum(int(re.sub(r"\D", "", str(i.get("min", "0"))) or 0) for i in b.get("items", []))
            if tot != L["plan_minutes"]:
                P.append(f"Study plan totals {tot} min; must total {L['plan_minutes']}")
        elif t == "critique_card" or t is None:
            pass

    if mode == "critique":
        s = sum(1 for b in flat if b.get("type") == "critique_card" and b.get("kind") == "strength")
        w = sum(1 for b in flat if b.get("type") == "critique_card" and b.get("kind") == "weakness")
        rng(P, "Strength cards", s, L["strength"])
        rng(P, "Weakness cards", w, L["weakness"])
    if mode == "deep-dive":
        if not count("pipeline") + count("mindmap") + count("cycle"):
            P.append("Deep Dive needs at least one diagram (pipeline, cycle or mindmap)")
        if count("table") + count("compare") < 1:
            P.append("Deep Dive needs at least one table or compare block")
        if not any(b.get("type") == "section" and b.get("role") == "researcher" for b in flat):
            P.append("Deep Dive needs the Researcher section (section with role: researcher)")
    if mode == "review-guide":
        sheets = [b for b in blocks if b.get("type") == "sheet"]
        if len(sheets) != 4:
            P.append(f"Review Guide must have exactly 4 top-level sheet blocks (has {len(sheets)})")
        if sheets:
            s1 = [x.get("type") for x in all_blocks(sheets[0].get("blocks"))]
            for need in ("mindmap", "preview"):
                if need not in s1:
                    P.append(f"Review Guide page 1 must contain the {need}")
            if "quiz" not in [x.get("type") for x in all_blocks(sheets[-1].get("blocks"))]:
                P.append("Review Guide page 4 must contain the quiz")

    if mode == "vocab-treasure":
        items = [it for b in flat if b.get("type") == "vocab" for it in b.get("items", [])]
        rng(P, "Vocab entries", len(items), L["entries"])
        seen = set()
        for it in items:
            term = it.get("term", "?")
            if term.lower() in seen:
                P.append(f"Vocab '{term}' appears twice")
            seen.add(term.lower())
            for k in ("term", "type", "level", "meaning", "context", "page", "example"):
                if not it.get(k):
                    P.append(f"Vocab '{term}' missing '{k}'")
            if it.get("level") not in ("C1", "C2"):
                P.append(f"Vocab '{term}': level must be C1 or C2 (be picky)")
            if words(it.get("meaning")) > 22:
                P.append(f"Vocab '{term}': meaning is {words(it.get('meaning'))} words (max 22)")
            if not (2 <= len(it.get("alternatives", [])) <= 4):
                P.append(f"Vocab '{term}': needs 2 to 4 alternatives")
            if words(it.get("example")) > 34:
                P.append(f"Vocab '{term}': example is {words(it.get('example'))} words (max 34)")
            if not re.search(r"(PDF )?pp?\.\s?\d", it.get("page", "")):
                P.append(f"Vocab '{term}': page must look like 'p. 12' or 'PDF p. 4'")
            core = [w for w in re.findall(r"[a-z]+", term.lower()) if len(w) > 3 and w not in ("someone", "something", "with", "from", "into")]
            if core and not any(w[:5] in it.get("example", "").lower() for w in core):
                P.append(f"Vocab '{term}': the example sentence must use the expression")
        qz = first("quiz")
        if qz is None:
            pass  # the quiz is optional in Vocab Treasure (only if room is left)

    # ---- writing rules and placeholders on authored text
    for path, s, verbatim in strings({"meta": {k: v for k, v in meta.items() if k != "paper"}, "blocks": blocks}, "spec", False):
        if not skeleton and PLACEHOLDER.search(s):
            P.append(f"Unfilled placeholder at {path}: {PLACEHOLDER.search(s).group(0)}")
        if verbatim:
            continue
        if DASH.search(s):
            P.append(f"Em/en dash at {path}: use a comma, colon, parentheses or hyphen")
        if "!" in s:
            P.append(f"Exclamation mark at {path}")
        low = s.lower()
        for w in RED_LIST:
            if w in low:
                P.append(f"AI-tell '{w}' at {path}")
    return P

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Validate an Easy Paper spec")
    ap.add_argument("spec"); ap.add_argument("--mode", choices=MODES)
    a = ap.parse_args()
    probs = validate(json.loads(Path(a.spec).read_text(encoding="utf-8-sig")), a.mode)
    for p in probs:
        print(" -", p)
    print("OK" if not probs else f"{len(probs)} problem(s)")
    sys.exit(2 if probs else 0)
