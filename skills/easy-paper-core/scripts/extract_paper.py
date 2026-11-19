#!/usr/bin/env python3
"""Extract a paper (PDF/DOCX/TXT) into page-marked text for the Easy Paper pipeline.

python3 extract_paper.py paper.pdf --out WORKDIR

Writes WORKDIR/paper.txt with markers like
    ===== [PDF p.3 | printed p.114] =====
and WORKDIR/paper-meta.json with page count, printed-page offset (if detected),
word count, DOI, a guessed title, and a scanned-PDF warning.
Always cite PRINTED page numbers in outputs; fall back to PDF numbers only when
no printed numbers exist (then say "PDF p.").
"""
import argparse, json, re, shutil, subprocess, sys
from collections import Counter
from pathlib import Path

def pdf_pages(pdf):
    out = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, encoding="utf-8", check=True).stdout
    m = re.search(r"Pages:\s+(\d+)", out)
    return int(m.group(1)) if m else 0

def page_text(pdf, n):
    return subprocess.run(["pdftotext", "-enc", "UTF-8", "-layout", "-f", str(n), "-l", str(n), str(pdf), "-"],
                          capture_output=True, encoding="utf-8", check=True).stdout

def detect_offset(texts):
    """Guess printed = pdf + offset from standalone numbers in page headers/footers."""
    votes = Counter()
    for i, t in enumerate(texts, 1):
        lines = [l.strip() for l in t.splitlines() if l.strip()]
        edge = lines[:3] + lines[-3:]
        for l in edge:
            for m in re.finditer(r"(?:^|\s)(\d{1,4})(?:\s|$)", l):
                v = int(m.group(1))
                if 0 < v < 5000 and not (1900 <= v <= 2100):
                    votes[v - i] += 1
    if not votes:
        return None
    off, c = votes.most_common(1)[0]
    return off if c >= max(2, len(texts) // 3) else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paper")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    src, out = Path(a.paper), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    meta = {"source": str(src)}
    if src.suffix.lower() == ".pdf":
        if shutil.which("pdfinfo") and shutil.which("pdftotext"):
            n = pdf_pages(src)
            texts = [page_text(src, i) for i in range(1, n + 1)]
        else:
            from pypdf import PdfReader
            texts = [page.extract_text() or "" for page in PdfReader(str(src)).pages]
            n = len(texts)
        off = detect_offset(texts)
        meta.update(pdf_pages=n, printed_offset=off)
        chunks = []
        for i, t in enumerate(texts, 1):
            pr = f" | printed p.{i + off}" if off is not None else ""
            chunks.append(f"\n===== [PDF p.{i}{pr}] =====\n{t}")
        full = "".join(chunks)
        if len(full.split()) < 80 * max(n, 1):
            meta["warning"] = "Very little text: the PDF may be scanned. Rasterise pages and read them visually or OCR."
    elif src.suffix.lower() == ".docx":
        full = subprocess.run(["pandoc", "-t", "plain", str(src)], capture_output=True, encoding="utf-8", check=True).stdout
        meta.update(pdf_pages=None, printed_offset=None)
    else:
        full = src.read_text(encoding="utf-8-sig")
        meta.update(pdf_pages=None, printed_offset=None)
    (out / "paper.txt").write_text(full, encoding="utf-8")
    meta["words"] = len(full.split())
    doi = re.search(r"10\.\d{4,9}/[^\s\"<>]+", full)
    meta["doi"] = doi.group(0).rstrip(".,;)") if doi else None
    first = [l.strip() for l in full.splitlines() if len(l.strip()) > 12][:6]
    meta["first_lines"] = first
    (out / "paper-meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(json.dumps(meta, indent=2))

if __name__ == "__main__":
    main()
