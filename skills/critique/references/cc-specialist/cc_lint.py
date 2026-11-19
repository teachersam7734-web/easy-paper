#!/usr/bin/env python3
"""cc_lint.py: mechanical checks for a Critical Commentary (CC).

Usage:
  python3 cc_lint.py CC.md [--paper paper.txt] [--json]

The CC should use headings containing "Summary", "Strength" and "Weakness"
(Markdown '#' headings or plain heading lines). Everything before the Summary
heading is treated as the title block and is not counted.

Checks: section word counts and proportions; dashes, exclamation marks,
questions; first person; student slips and cliches; red-list AI-tell words;
contrast and consequence connectors in Weaknesses; sentence-length spread;
repeated sentence openers; copied strings (6+ words) shared with the paper.
These are signals for the self-audit, not a verdict on authorship.
"""
import re, sys, json, statistics, argparse

RED = ["delve", "delves", "delving", "underscore", "underscores", "underscoring", "showcase", "showcases",
       "showcasing", "pivotal", "crucial", "intricate", "intricacies", "interplay", "meticulous", "meticulously",
       "commendable", "laudable", "noteworthy", "invaluable", "indispensable", "groundbreaking", "cutting-edge",
       "seamless", "seamlessly", "multifaceted", "myriad", "plethora", "realm", "tapestry", "testament", "boasts",
       "leverage", "harness", "foster", "bolster", "elevate", "streamline", "illuminate", "unveil", "garner",
       "paramount", "shed light", "sheds light", "paves the way", "plays a crucial role", "plays a pivotal role",
       "valuable insights", "nuanced understanding", "ever-evolving", "navigate the complexities",
       "it is worth noting", "it is important to note", "are to be commended", "solid foundation",
       "when it comes to", "that being said", "serves as", "stands as", "landscape of"]
SLIPS = ["last but not least", "as we all know", "frankly", "to me,", "to me ", "for me,", "a bit odd",
         "nice and neat", "in my opinion", "i believe", "i found", "i think", "i feel", "needless to say",
         "it goes without saying", "in today's world", "cure-for-all", "really insightful", "outstanding job"]
FIRST = r"\b(I|[Mm]e|[Mm]y|[Mm]ine)\b"
# "I" after these words is a numeral (Type I error, Study I), not first person
NUMERAL_I = re.compile(r"(type|study|phase|part|experiment|section|chapter|figure|table|appendix|volume|book|level|class)\s+$", re.I)
CONTRAST = ["however", "although", "while", "whereas", "nevertheless", "nonetheless", "yet", "that said",
            "even so", "at the same time", "despite", "notwithstanding"]
CONSEQ = ["as a result", "therefore", "consequently", "thus", "this means", "hence", "for this reason",
          "this leaves", "this limits", "this weakens", "this undercuts"]
TARGET = {"summary": (0.35, 0.47), "strengths": (0.17, 0.27), "weaknesses": (0.30, 0.42)}


def split_sections(text):
    secs = {"title": [], "summary": [], "strengths": [], "weaknesses": []}
    cur = "title"
    for line in text.splitlines():
        s = line.strip().lstrip("#").strip().lower()
        if len(s) < 60 and re.match(r"^(summary|overview)", s): cur = "summary"; continue
        if len(s) < 60 and re.match(r"^(major )?(strength|merit|advantage)", s): cur = "strengths"; continue
        if len(s) < 60 and re.match(r"^(major )?(weakness|limitation|disadvantage|drawback|critique|critical evaluation|evaluation)", s): cur = "weaknesses"; continue
        secs[cur].append(line)
    return {k: "\n".join(v).strip() for k, v in secs.items()}


def first_person(t):
    n = 0
    for m in re.finditer(FIRST, t):
        if m.group(1) == "I" and NUMERAL_I.search(t[max(0, m.start() - 12):m.start()]):
            continue
        n += 1
    return n


def words(t):
    return re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", t)


def sentences(t):
    t = re.sub(r"\s+", " ", t)
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'(])", t)
    return [p for p in parts if len(words(p)) > 2]


def count_terms(t, terms):
    low = t.lower(); hits = {}
    for term in terms:
        n = len(re.findall(r"(?<![a-z])" + re.escape(term) + r"(?![a-z])", low))
        if n: hits[term] = n
    return hits


def shingles(t, n=6):
    w = [x.lower() for x in words(t)]
    return {" ".join(w[i:i + n]) for i in range(len(w) - n + 1)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cc"); ap.add_argument("--paper"); ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    text = open(a.cc, encoding="utf-8").read()
    secs = split_sections(text)
    body = "\n".join(secs[k] for k in ("summary", "strengths", "weaknesses"))
    wc = {k: len(words(secs[k])) for k in ("summary", "strengths", "weaknesses")}
    total = sum(wc.values()) or 1
    rep = {"words": wc, "total": total, "share": {k: round(v / total, 2) for k, v in wc.items()}}
    flags = []
    if not (850 <= total <= 1150): flags.append(f"total {total} words (target about 900 to 1,000)")
    for k, (lo, hi) in TARGET.items():
        if not (lo <= rep["share"][k] <= hi): flags.append(f"{k} share {rep['share'][k]:.0%} (target {lo:.0%} to {hi:.0%})")
    if wc["weaknesses"] < wc["strengths"]: flags.append("Weaknesses shorter than Strengths")
    rep["em_en_dashes"] = len(re.findall("[\u2014\u2013]", body)) + len(re.findall(r"(?<!-)--(?!-)", body)) + len(re.findall(r"(?<=\S) +- +(?=\S)", body))
    rep["exclamations"] = body.count("!")
    rep["questions"] = len(re.findall(r"\?", body))
    rep["first_person"] = first_person(body)
    rep["slips"] = count_terms(body, SLIPS)
    rep["red_list"] = count_terms(body, RED)
    rep["weak_contrast"] = sum(count_terms(secs["weaknesses"], CONTRAST).values())
    rep["weak_consequence"] = sum(count_terms(secs["weaknesses"], CONSEQ).values())
    if rep["em_en_dashes"]: flags.append(f"{rep['em_en_dashes']} em/en dash(es)")
    if rep["exclamations"]: flags.append(f"{rep['exclamations']} exclamation mark(s)")
    if rep["questions"] > 1: flags.append(f"{rep['questions']} question marks (max 1)")
    if rep["first_person"] > 1: flags.append(f"{rep['first_person']} first-person forms (max 1 in WRITE mode)")
    if rep["slips"]: flags.append("student slips/cliches: " + ", ".join(rep["slips"]))
    if rep["red_list"]: flags.append("red-list words: " + ", ".join(rep["red_list"]))
    if rep["weak_contrast"] < 2: flags.append(f"Weaknesses: {rep['weak_contrast']} contrast connector(s) (aim 2+)")
    if rep["weak_consequence"] < 1: flags.append("Weaknesses: no consequence connector (aim 1+)")
    sents = sentences(body); lens = [len(words(s)) for s in sents]
    if lens:
        mean = statistics.mean(lens); sd = statistics.pstdev(lens)
        rep["sentences"] = {"n": len(lens), "mean": round(mean, 1), "cv": round(sd / mean, 2), "max": max(lens),
                            "min": min(lens)}
        if max(lens) > 45: flags.append(f"longest sentence {max(lens)} words (max 45)")
        if sd / mean < 0.35: flags.append(f"low sentence-length variation (CV {sd / mean:.2f}); soft target about 0.45")
        runs = 0
        for i in range(len(lens) - 3):
            w = lens[i:i + 4]
            if max(w) - min(w) <= 5: runs += 1
        if runs: flags.append(f"{runs} run(s) of 4 sentences within a 5-word length band")
        starts = [words(s)[0].lower() for s in sents if words(s)]
        common = max(set(starts), key=starts.count)
        if starts.count(common) / len(starts) > 0.3: flags.append(f"{starts.count(common)} sentences start with '{common}'")
    if a.paper:
        ptxt = open(a.paper, encoding="utf-8", errors="ignore").read()
        # Blank out quoted spans (double or curly quotes only; a straight apostrophe is
        # usually a possessive) so no shingle straddles a quotation boundary.
        unquoted = re.sub(r"\"[^\"]*\"|\u201c[^\u201d]*\u201d|\u2018[^\u2019]{3,}\u2019", " | ", body)
        shared = set()
        for chunk in unquoted.split("|"):
            shared |= shingles(chunk) & shingles(ptxt)
        rep["copied_6grams_outside_quotes"] = len(shared)
        rep["copied_examples"] = sorted(shared)[:8]
        if len(shared) > 3: flags.append(f"{len(shared)} six-word strings shared with the paper outside quotation marks (patchwriting risk)")
    rep["flags"] = flags
    if a.json:
        print(json.dumps(rep, indent=1)); return
    print(f"Words: total {total} | " + " | ".join(f"{k} {wc[k]} ({rep['share'][k]:.0%})" for k in wc))
    if "sentences" in rep: print("Sentences:", rep["sentences"])
    print(f"Weaknesses connectors: contrast {rep['weak_contrast']}, consequence {rep['weak_consequence']}")
    print("FLAGS:" if flags else "No flags.")
    for f in flags: print("  -", f)


if __name__ == "__main__":
    main()
