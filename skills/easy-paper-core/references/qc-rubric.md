# QC rubric (the Inspector)

The Inspector did not write the output and does not trust it. Run the tools first, then read.

## Step 1. Tools
1. `python scripts/validate.py <spec>`: must be clean.
2. `python scripts/check_quotes.py <spec> <workspace>/paper.txt`: every verbatim quote must be found, on the cited page.
3. Render, then `pdftoppm -r 60 -png <pdf> <workspace>/qc/page`: look at every page image.

## Step 2. Fact spot-check (at least 10 claims, 15 for Deep Dive)
Pick numbers, pages, named findings and "the authors do not..." claims. Search `paper.txt` for each. Record each one as OK, WRONG (with the fix) or UNSUPPORTED. Any WRONG fact is a **critical** issue.

## Step 3. Score (each 0 to 10, weighted)

| # | Criterion | Weight | 10 looks like |
|---|---|---|---|
| 1 | Fidelity | 20% | Every claim, number and page matches the paper; the authors would recognise their message |
| 2 | Gold nuggets up front | 12% | A reader who stops after the nuggets and short answers has the 80% |
| 3 | Hunt-question chunking | 10% | Real questions, one idea each, short answers that answer them |
| 4 | Plain language | 12% | A tired first-year MA student understands it at first read; terms glossed once |
| 5 | Visual load-bearing | 10% | Every chunk has a visual that carries content; no decoration |
| 6 | Mode fit | 12% | Deep Dive: presentable mastery plus newer work. Critique: fair, anchored, speakable. Review Guide: 80/20, readable cold in 2 hours |
| 7 | Preview and quiz quality | 8% | Previews map to chunks; the quiz mixes types; answers anchored |
| 8 | Verbatim discipline | 6% | Quotes only where canonical; all verified |
| 9 | Layout | 6% | Page budget met; no overflow, orphans or half-empty pages; diagrams legible |
| 10 | Writing rules | 4% | Validator clean; no stiff written-register sentences in say-it lines |

**Caps:** any critical issue (a wrong fact, an invented citation, a missing quote) caps the score at 6.0. Missing preview or quiz caps it at 7.0. Breaking the page budget caps it at 7.5.

**Verdict:** PASS if the score is at least 8.5 and there are no critical issues; otherwise FIX.

## Step 4. Report (`qc-report.md`)
```
Score: 8.7 / 10  Verdict: PASS
Tools: validate OK · check_quotes 4/4 OK · pages 8 (budget 5-10)
Fact checks: 15 checked, 15 OK
Fix list (ranked):
1. [major] p.3 HQ2 table row 2: "1978" should be "1979" (paper.txt PDF p.4)
2. [minor] p.6 say-it line too long (31 words); cut to 25
Fairness (Critique only): each weakness's absence claim was searched: OK
```
Send the fix list to the Designer (or the persona that owns the content). Allow at most two FIX loops, then deliver with any residual notes.
