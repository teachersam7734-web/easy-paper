---
name: critique
description: Easy Paper's Critique mode. It turns an Applied Linguistics, SLA, TEFL or L2 acquisition paper into 3 to 5 pages of reader-friendly, speakable critique notes (summary beats, anchored strengths, fair weaknesses with fixes, a one-breath verdict, a 90-second oral script, and examiner follow-ups) for oral exams, vivas, seminars and class discussion. Built on the CC Specialist method, adapted for fluent speech and easy memorising. Use when the user wants a critique, critical commentary notes, strengths and weaknesses, limitations, an evaluation of a paper, or preparation to discuss or defend a view on a paper aloud.
---

# Critique Notes

**Who it is for:** a student who must *talk* critically about a paper (oral exam, seminar, viva) and remember what to say under pressure.
**What they get:** 3 to 5 pages. The verdict and ratings come first. Then: preview questions, the paper in 4 nuggets and 3 to 4 summary chunks, 3 to 4 strength cards, 3 to 5 weakness cards (each with proof, why it matters, a fix and a say-it line), a 90-second oral script with a memory hook, examiner Q&A, a Wrap-Up Quiz and the answer key.

**Main reference:** the CC Specialist method in `references/cc-specialist/` (unchanged copies of the user's skill). Read `references/cc-adaptation.md` to see how its written CC becomes speakable cards. The thinking is identical; only the form changes.

Read first: `../easy-paper-core/SKILL.md`, then `references/pipeline.md`.

## Pipeline at a glance

| Stage | Persona / agent | Output | Parallel? |
|---|---|---|---|
| 0 Intake | you | `paper.txt`, meta | |
| 1 Summary beats | The Analyst (`ep-analyst`) | `dossier.md`, `analyst.md` | |
| 2 Judgment | The Judge (`ep-judge`) | `judge.md` (yardstick, verdict, ratings, FAE strengths, CECA weaknesses, fairness log) | |
| 3 Make it speakable | The Coach (`ep-coach`) | `coach.md` (titles, say-it lines, 90-s script, examiner Q&A, memory hook) | runs alongside 4 |
| 4 Questions | The Quizmaster (`ep-quizmaster`) | `quiz.md` | runs alongside 3 |
| 5 Build | The Designer (`ep-designer`) | `critique.spec.json`, PDF | |
| 6 QC + fairness re-check | The Inspector (`ep-inspector`) | `qc-report.md` | |

Without subagents, use the relay protocol in `../easy-paper-core/references/persona-system.md`.

## Mode rules
- Fairness is a hard gate: every "the authors do not..." is searched in paper.txt (the item plus two synonyms) before it appears. Inspect the relevant section, tables and available supplements too. A failed text search cannot establish an omission. If a detail is unclear, describe what the available report establishes and how the uncertainty affects the conclusion. The Inspector re-checks it.
- Every card has an anchor with a printed page. Every weakness has a fix.
- Say-it lines are at most 25 words, spoken register, one idea, no stacked hedges.
- The summary beats stay neutral; evaluation lives only in the verdict and the cards.
- The ratings must agree with the cards.
- Theme and fonts: `assets/theme.css` (indigo lead, green strengths, pink weaknesses; Space Grotesk headings, Inter body, EB Garamond italic say-it lines).

## References
| File | Use |
|---|---|
| `references/pipeline.md` | Step-by-step procedure with persona briefs |
| `references/cc-adaptation.md` | How a CC becomes Critique Notes: field mapping, ratings |
| `references/cc-specialist/` | Mindset, 14-step pipeline, brainstorm bank, template, humanizer, exemplar (main reference) |
| `references/oral-phrasebank.md` | Spoken frames for openings, signposts, strengths, weaknesses, verdicts, follow-ups |
| `references/layout-template.md` | Block order and budgets |
| `references/glossary.md` | Critique craft terms (yardstick, FAE, CECA, fairness filter, severity) |
| `assets/skeleton.spec.json` | Starter spec |

## Worked examples

Consult the recovered Markdown for this mode when you need an example of scope, structure and tone.

- [Ibrahim approved output](examples/ai-plagiarism.md)
- [Lund approved output](examples/ai-publishing.md)
- [Johnson approved output](examples/mixed-methods.md)
