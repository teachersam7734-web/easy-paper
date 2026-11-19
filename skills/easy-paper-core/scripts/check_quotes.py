#!/usr/bin/env python3
"""Verify that every verbatim quote in a spec really appears in the paper text.

python3 check_quotes.py spec.json paper.txt

Checks definition.quote (verbatim) and quote.text blocks. Matching ignores case,
whitespace, line-break hyphenation and quote marks, and reports the PDF page where
each quote was found so the cited page can be compared. Exit 2 if any quote is
missing or cited on the wrong page.
"""
import json, re, sys
from pathlib import Path

def norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = re.sub(r"-\s*\n\s*", "", s)
    s = re.sub(r"[^\w']+", " ", s.lower())
    return re.sub(r"\s+", " ", s).strip()

def pages_index(txt):
    parts = re.split(r"(?:^|\n)===== \[PDF p\.(\d+)(?: \| printed p\.(\d+))?\] =====\n", txt)
    idx = []  # (pdf, printed, normtext)
    if len(parts) < 3:
        return [(None, None, norm(txt))]
    for i in range(1, len(parts), 3):
        idx.append((parts[i], parts[i + 1], norm(parts[i + 2] if i + 2 < len(parts) else "")))
    return idx

def iter_quotes(node):
    if isinstance(node, dict):
        t = node.get("type")
        if t == "definition" and node.get("quote") and node.get("verbatim", True):
            yield node.get("term", "?"), node["quote"], node.get("source", "")
        if t == "vocab":
            for it in node.get("items", []):
                if it.get("context"):
                    yield it.get("term", "?"), it["context"], it.get("page", "")
        if t == "quote" and node.get("text") and node.get("verbatim", True):
            yield "pull quote", node["text"], node.get("source", "")
        for v in node.values():
            yield from iter_quotes(v)
    elif isinstance(node, list):
        for v in node:
            yield from iter_quotes(v)

def cited_pages(src):
    pages = set()
    for a, b in re.findall(r"pp?\.\s?(\d+)(?:\s?-\s?(\d+))?", src):
        a = int(a); b = int(b) if b else a
        pages.update(str(x) for x in range(a, b + 1))
    return pages

def main():
    import argparse
    ap = argparse.ArgumentParser(description="Verify verbatim quotes in an Easy Paper spec against paper.txt")
    ap.add_argument("spec"); ap.add_argument("paper_txt")
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text(encoding="utf-8-sig"))
    idx = pages_index(Path(a.paper_txt).read_text(encoding="utf-8-sig"))
    joined = " ".join(p[2] for p in idx)
    bad = n = 0
    for term, q, src in iter_quotes(spec.get("blocks", [])):
        n += 1
        if norm(q) in joined:
            pieces = [norm(q)]
        else:
            q2 = re.sub(r"\[[^\]]*\]|\.\.\.|…", " ||| ", q)
            pieces = [norm(x) for x in q2.split("|||") if len(norm(x).split()) >= 2] or [norm(q)]
        found, ok = [], True
        for piece in pieces:
            hit = [(pdf, pr) for pdf, pr, t in idx if piece in t]
            if not hit and piece not in joined:
                ok = False
            found += hit
        cited = cited_pages(src)
        where = ", ".join(sorted({f"printed p.{pr}" if pr else f"PDF p.{pdf}" for pdf, pr in found})) or "spans a page break"
        found_set = {(pdf if re.search(r"\bPDF\s+pp?\.", src, re.I) else pr or pdf) for pdf, pr in found if pdf is not None}
        if not ok:
            bad += 1
            print(f"MISSING  [{term}] not found verbatim in paper: \"{q[:90]}...\"")
        elif cited and found_set and not (cited & found_set):
            bad += 1
            print(f"PAGE?    [{term}] cited p.{'/'.join(sorted(cited, key=int))} but found on {where}")
        else:
            print(f"OK       [{term}] {where}")
    print(f"{n - bad}/{n} quotes OK")
    sys.exit(2 if bad else 0)

if __name__ == "__main__":
    main()
