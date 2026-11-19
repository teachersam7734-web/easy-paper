---
name: review-guide
description: Easy Paper's Review Guide mode. It makes an exactly 4-page, 80/20 exam cram guide for an Applied Linguistics, SLA, TEFL or L2 acquisition paper, built for a student with about 2 hours who may not have read the paper at all. Page 1 has a mind map, preview questions and gold nuggets; pages 2 and 3 hold the ranked must-knows that earn most of the marks; page 4 has likely exam questions, a 2-hour game plan and a Wrap-Up Quiz. Use when the user has an exam soon, is short of time, wants to cram, wants a summary, cheat sheet, study guide or review sheet, or says they have not read the paper.
---

# Review Guide

**Who it is for:** a student with about 2 hours before an exam on this paper. They remember little and may not have skimmed it.
**What they get:** exactly 4 A4 pages, applying the 80/20 rule: the 20% of the paper that carries 80% of its value on a test.

| Page | Title | Content |
|---|---|---|
| 1 | The big picture | compact header, 4 preview questions, the **mind map** (kept from the user's original design), "If you remember one thing", 3 to 5 gold nuggets |
| 2 | Must-knows (1/2) | the top-ranked must-knows as compact Hunt-Question chunks with exam-weight stars, verbatim definitions where canonical, a visual each |
| 3 | Must-knows (2/2) | the remaining must-knows, "numbers worth memorising", memory hooks, "don't mix these up" contrasts |
| 4 | Exam ready | likely exam questions with model answers, the 2-hour game plan, the Wrap-Up Quiz (8), the answer key |

What changes from the user's earlier review guides: they assumed hours of prior study and listed everything (a final glance). This guide **teaches from zero, ranks by exam value, and leaves out the rest**.

Read first: `../easy-paper-core/SKILL.md`, then `references/pipeline.md`.

## Pipeline at a glance
| Stage | Persona / agent | Output |
|---|---|---|
| 0 Intake | you | `paper.txt`, meta |
| 1 Dossier | The Analyst (`ep-analyst`) | `dossier.md` (reused if present) |
| 2 80/20 | The Distiller (`ep-distiller`) | `distiller.md`: the one thing, mind-map content, ranked must-knows, definitions, numbers, hooks, contrasts, exam questions, 2-hour plan |
| 3 Questions | The Quizmaster (`ep-quizmaster`) | `quiz.md` (4 preview, 8 quiz) |
| 4 Build | The Designer (`ep-designer`) | `review-guide.spec.json` (4 `sheet`s), PDF |
| 5 QC | The Inspector (`ep-inspector`) | `qc-report.md` |

Without subagents, use the relay protocol in `../easy-paper-core/references/persona-system.md`.

## Mode rules
- Exactly 4 sheets. If a sheet overflows, cut the lowest exam-weight item; never shrink type below the theme.
- Mind map: 5 to 7 branches, 2 to 4 leaves each, each leaf at most 8 words, no full sentences. See `references/mindmap-rules.md`.
- Must-knows are ranked by exam weight (`references/eighty-twenty.md`); use the instructor's stated objectives if supplied. Otherwise label stars as suggested revision priorities inferred from the paper. Each item shows stars (★★★, ★★, ★) in its chunk id or title.
- Assume zero prior reading. Every term is glossed the first time.
- At most 5 verbatim definitions.
- The 2-hour plan totals 120 minutes and includes the quiz and a blind-recall step.
- Theme and fonts: `assets/theme.css` (gold-orange lead with cyan; Outfit headings, Inter body, JetBrains Mono labels).

## References
| File | Use |
|---|---|
| `references/pipeline.md` | Step-by-step procedure and persona briefs |
| `references/eighty-twenty.md` | Exam-weight scoring and the cut line |
| `references/mindmap-rules.md` | How to build the page 1 mind map |
| `references/memory-hooks.md` | Hooks, contrasts, numbers: making the 20% stick |
| `references/layout-template.md` | The exact 4-sheet template with budgets |
| `references/glossary.md` | Review-guide craft terms |
| `assets/skeleton.spec.json` | Starter spec |

## Worked examples

Consult the recovered Markdown for this mode when you need an example of scope, structure and tone.

- [Ibrahim approved output](examples/ai-plagiarism.md)
- [Lund approved output](examples/ai-publishing.md)
- [Johnson approved output](examples/mixed-methods.md)
