#!/usr/bin/env python3
"""Easy Paper layout checker: inspects a rendered PDF for page-layout defects.

python3 layout_check.py file.pdf [--mode deep-dive|critique|review-guide] [--json]

Checks every page (A4, 13 mm top/bottom margins, footer in the bottom margin):
  TRESPASS   body text inside the header/footer margins or outside the side margins
  OVERLAP    text drawn on top of other text (overlapping boxes, colliding diagram labels)
  UNDERFILL  a page that is too empty (non-last pages < 72% filled; Review Guide sheets < 85%)
  GAP        a large blank band inside a page (> 38 mm with no text or graphics)
  LASTPAGE   a last page holding only a few lines (< 22% filled): pull content back or cut
  ORPHAN     a heading stranded at the bottom of a page with its content on the next page
  TINY       body text smaller than 6.5 pt (illegible when printed)
Exit 2 if any defect is found. render.py runs this automatically after every render.
See references/page-layout.md for the fixes.
"""
import argparse, json, sys
from pathlib import Path

MM = 72 / 25.4  # points per mm
MARGIN_TB = 13 * MM
SIDE = 9 * MM
FOOTER_MAX_SIZE = 6.2  # footer text is ~5.3 pt

def lines_of(words, tol=2.0):
    rows = []
    for w in sorted(words, key=lambda w: (round(w["top"]), w["x0"])):
        if rows and abs(rows[-1]["top"] - w["top"]) <= tol:
            r = rows[-1]; r["words"].append(w); r["bottom"] = max(r["bottom"], w["bottom"]); r["size"] = max(r["size"], w["size"])
        else:
            rows.append({"top": w["top"], "bottom": w["bottom"], "size": w["size"], "words": [w]})
    for r in rows:
        r["text"] = " ".join(x["text"] for x in sorted(r["words"], key=lambda x: x["x0"]))
        r["bold"] = any("Bold" in (x.get("fontname") or "") or "Semi" in (x.get("fontname") or "") for x in r["words"])
    return rows

def overlap_area(a, b):
    x = min(a["x1"], b["x1"]) - max(a["x0"], b["x0"])
    y = min(a["bottom"], b["bottom"]) - max(a["top"], b["top"])
    return x * y if x > 0 and y > 0 else 0

def check(pdf_path, mode=None):
    import logging
    logging.getLogger("pdfminer").setLevel(logging.ERROR)
    import pdfplumber
    probs = []
    full = mode == "vocab-treasure"   # full-bleed sheets: 12 mm top, footer drawn at ~285 mm
    with pdfplumber.open(pdf_path) as pdf:
        n = len(pdf.pages)
        for i, page in enumerate(pdf.pages, 1):
            W, H = page.width, page.height
            words = page.extract_words(extra_attrs=["size", "fontname"], keep_blank_chars=False, use_text_flow=False)
            mt = 11 * MM if full else MARGIN_TB
            body = [w for w in words if not (w["top"] > H - MARGIN_TB and (w["size"] <= FOOTER_MAX_SIZE or full))]
            # TRESPASS
            for w in body:
                if w["bottom"] > H - MARGIN_TB + 1.5 or w["top"] < mt - 1.5:
                    probs.append(f"TRESPASS p.{i}: '{w['text'][:30]}' sits in the header/footer margin"); break
            for w in body:
                if w["x0"] < SIDE or w["x1"] > W - SIDE:
                    probs.append(f"TRESPASS p.{i}: '{w['text'][:30]}' runs outside the side margin"); break
            # OVERLAP (word boxes colliding)
            srt = sorted(body, key=lambda w: w["top"])
            hits = 0
            for a_i, a in enumerate(srt):
                for b in srt[a_i + 1:]:
                    if b["top"] > a["bottom"]:
                        break
                    ar = overlap_area(a, b)
                    small = min((a["x1"] - a["x0"]) * (a["bottom"] - a["top"]), (b["x1"] - b["x0"]) * (b["bottom"] - b["top"])) or 1
                    if ar / small > 0.35:
                        hits += 1
                        if hits == 1:
                            probs.append(f"OVERLAP p.{i}: '{a['text'][:24]}' collides with '{b['text'][:24]}' (y = {a['top']/MM:.0f} mm)")
            # TINY
            # letter-spaced ALL-CAPS labels stay legible small; judge lowercase running text only
            tiny = [w for w in body if w["size"] < 6.5 and not (w["text"].isupper() or not any(c.isalpha() for c in w["text"]))]
            if len(tiny) > 3:
                probs.append(f"TINY p.{i}: {len(tiny)} words under 6.5 pt (e.g. '{tiny[0]['text'][:20]}'); enlarge or cut")
            # fill and gaps
            if not body:
                probs.append(f"UNDERFILL p.{i}: blank page"); continue
            area_top, area_bot = (mt, H - MARGIN_TB) if full else (MARGIN_TB, H - MARGIN_TB)
            area_h = area_bot - area_top
            content_bottom = max(w["bottom"] for w in body)
            graphics = [o for o in (page.rects + page.curves + page.lines + page.images)
                        if (o.get("bottom", 0) - o.get("top", 0)) < H * 0.9]
            if graphics:
                content_bottom = max(content_bottom, max(min(o["bottom"], area_bot) for o in graphics))
            fill = (content_bottom - area_top) / area_h
            last = i == n
            if mode in ("review-guide", "vocab-treasure"):
                if fill < 0.85:
                    probs.append(f"UNDERFILL p.{i}: sheet only {fill:.0%} filled ({(area_bot-content_bottom)/MM:.0f} mm empty at the bottom); add a 2-star item or enlarge the visual")
            elif last:
                if fill < 0.22 and n > 1:
                    probs.append(f"LASTPAGE p.{i}: only {fill:.0%} filled; tighten earlier pages to pull it back, or cut")
            elif fill < 0.72:
                probs.append(f"UNDERFILL p.{i}: only {fill:.0%} filled ({(area_bot-content_bottom)/MM:.0f} mm empty); a block was pushed to the next page. Split it, move a smaller block up, or reorder")
            # internal gaps: blank bands with neither text nor graphics
            spans = sorted([(w["top"], w["bottom"]) for w in body] +
                           [(o["top"], o["bottom"]) for o in graphics if o["bottom"] > area_top])
            cur = area_top
            for t, b in spans:
                if t - cur > 38 * MM and cur > area_top + 5:
                    probs.append(f"GAP p.{i}: {(t-cur)/MM:.0f} mm blank band at y = {cur/MM:.0f} mm; remove forced spacing or rebalance")
                    break
                cur = max(cur, b)
            # ORPHAN heading: last text line on the page is large/bold and sits in the bottom 15%
            rows = lines_of(body)
            if rows and not last:
                tail = rows[-1]
                if tail["top"] > area_bot - 0.15 * area_h and (tail["size"] >= 10.5 or (tail["bold"] and len(tail["text"].split()) <= 9)) and len(rows) > 3:
                    prev_gap = tail["top"] - rows[-2]["bottom"]
                    if tail["size"] >= 10.5 or prev_gap > 3 * MM:
                        probs.append(f"ORPHAN p.{i}: heading '{tail['text'][:40]}' is stranded at the page bottom")
    return probs

def main():
    ap = argparse.ArgumentParser(description="Check a rendered Easy Paper PDF for layout defects")
    ap.add_argument("pdf"); ap.add_argument("--mode"); ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    probs = check(a.pdf, a.mode)
    if a.json:
        print(json.dumps(probs, indent=1))
    else:
        for p in probs:
            print(" -", p)
        print("LAYOUT OK" if not probs else f"{len(probs)} layout defect(s)")
    sys.exit(2 if probs else 0)

if __name__ == "__main__":
    main()
