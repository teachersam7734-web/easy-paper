---
name: adhd-qc-rubric
description: The ADHD QC criteria and scoring used by the ADHD Auditor and the Distracted Reader to check any Easy Paper output (or any study material) for ADHD-friendliness. Read before running an ADHD QC.
---

# ADHD QC rubric

An ADHD QC asks one question: **will a distractible, time-poor reader get the gold, keep their place, and still remember it tomorrow?** It complements the Inspector (facts, quotes, layout) and never overrides fidelity: content changes are packaging changes, not new claims.

Two agents run it:
- **ADHD Auditor** (`ep-adhd-auditor`): scores the criteria below with evidence and writes a fix list; applies fixes when asked.
- **Distracted Reader** (`ep-distracted-reader`): simulates a skim, records where attention drops, and checks which target ideas have cues visible on a skim.
Their reports merge into one verdict.

Principle numbers (P1 to P28) refer to `science/design-principles-from-science.md`.

## Criteria (each scored 0 to 10)

| # | Criterion | Weight | 10 looks like | Principles |
|---|---|---|---|---|
| A1 | **Gold first** | 14% | Nuggets and short answers carry the 80%; a reader who stops after the first third of each page still has the message | P1, P4 |
| A2 | **Chunking and re-entry** | 12% | One job per chunk; each chunk can be entered cold (its question and answer make sense alone); clear place-keeping (numbers, ids) | P2, P9, P12 |
| A3 | **Working-memory load** | 12% | Terms defined at first use; short sentences; no nested conditions; no forward references; heavy definitions paired with a plain version | P3, P5, P6 |
| A4 | **Visual signalling** | 10% | Every chunk has a load-bearing visual; bold and highlight used sparingly and meaningfully; icons mark content types | P2, Mayer |
| A5 | **Goal and time cues** | 8% | A mission or goal up front; time chips or a plan; a visible finish line | P13, P14, P16, P18 |
| A6 | **Active retrieval** | 12% | Preview questions that make the reader guess; a mixed quiz with an answer key; recall prompts | P11, P23 |
| A7 | **Memory Links** | 10% | Every typology, list of 3 or more, and heavy definition has an accurate Memory Link or a tangible version | Memory Link playbook |
| A8 | **Interest and novelty** | 8% | Concrete examples, stakes, varied block types, a little game (scoreboard, missions) without gimmicks | P17, P19 |
| A9 | **Tone and honesty** | 6% | Calm, encouraging, non-judgmental; evidence strength stated where it matters; no overselling | P20, P28 |
| A10 | **Skim cue coverage** (from the Distracted Reader) | 8% | At least 80% of target ideas have an identifiable cue in the simulated reader's skim list | all |

**Red flags** (each caps the score at 7.0): a wall of text (a page with no visual and over 300 words of prose); a quiz without answers; a heavy definition with no plain version; a typology of 4 or more items with no Memory Link; a page whose first third has no takeaway.

**Verdict:** PASS when the score is at least 8.5 and there are no red flags; otherwise ADJUST.

## Mode-specific checks

| Mode | Also check |
|---|---|
| Deep Dive | The roadmap diagram appears before chunk 1; the presenter kit is speakable; the researcher section is clearly marked as outside the paper |
| Critique | Each card can be said in one breath; the order hook exists; the verdict comes first |
| Review Guide | The mind map is readable in 60 seconds; the 2-hour plan totals 120 minutes and includes blind recall; the 3-star items come first |
| Vocab Treasure | One idea per card; the in-context line highlights the item; examples are vivid and reusable; the quiz uses fill-the-gap retrieval. By design the mode has no preview questions, a 2 to 3 item quiz and a goal stat ("3 to steal this week") in the reel strip: score A5 and A6 against that design (a 2 to 3 item gap-fill quiz plus the in-context highlight counts as full retrieval for this mode), not against the study-guide modes |
| Any other study material | The same A1 to A10, adapted: a textbook chapter guide, notes, slides |

## Output format (`adhd-qc-<mode>.md`)
```
ADHD score: 8.9 / 10   Verdict: PASS
Red flags: none
Scores: A1 9 · A2 9 · A3 8 · A4 9 · A5 8 · A6 10 · A7 8 · A8 9 · A9 9 · A10 9
Distracted Reader: cues found for 6/7 nuggets in a simulated skim; attention dropped on p.4 (dense table)
Fix list (ranked):
1. p.4 HQ5: split the 6-row table into two 3-row tables, each with its own takeaway line
2. HQ3: add a Memory Link for the four classifier types ("W-T-S-R: Watermark, Train, Statistics, Retrieve")
```
When asked to adjust, apply fixes to the spec, re-render (render.py must print OK), and re-score.
