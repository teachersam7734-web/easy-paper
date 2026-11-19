---
name: vocab-treasure
description: "Easy Paper's Vocab Treasure mode. It mines an Applied Linguistics, SLA, TEFL or L2 paper for the most useful, pickiest academic language (C1-C2 collocations, fixed expressions, structures, hedges, reporting and signposting phrases, idioms) and prints a cinematic 1 to 2 page vault (about one page per 10 pages of article). Each entry gives the meaning, the verbatim in-context line with its page, alternatives and an original example, and the page ends with an optional 2 to 3 item quiz. Pages have no title block, only the footer 'Vocab Treasure - Sajjad Irani', so they can be bound into one booklet. Use when the user wants vocabulary, phrases, collocations, academic expressions or language to reuse in their own writing from a paper."
---

# Vocab Treasure

**Why it exists:** after 200 papers the student owns a hand-picked bank of academic language for proposals, papers and theses. Every page is a reel in that collection.
**Output:** 1 to 2 A4 sheets (1 page per about 10 pages of article: 13 pages gives 1, 20 to 24 gives 2), full-bleed "Midnight Reel" design. Each sheet holds 8 to 11 entry cards (the first can be a wide "feature" card), plus an optional Wrap-Up Quiz (2 to 3 fill-in-the-blank or mcq items) if there is room. No cover and no title block: just a reel strip (reel number, short source) and the footer `Vocab Treasure - Sajjad Irani`.
**Also:** every run appends its entries to the cumulative Treasure Chest (`scripts/vocab_bank.py`), a deduplicated CSV and Markdown bank across all papers.

Read first: `../easy-paper-core/SKILL.md`, then `references/pipeline.md` and `references/selection-criteria.md`.

## Pipeline at a glance
| Stage | Persona / agent | Output |
|---|---|---|
| 0 Intake | you | `paper.txt` |
| 1 Mine | The Lexicographer (`ep-lexicographer`) | `vocab.md`: 25 to 40 candidates scored, then the final 8 to 22 entries |
| 2 Build | The Designer (`ep-designer`) | `vocab-treasure.spec.json` (sheets), PDF |
| 3 Layout | The Layout Doctor (`ep-layout`) | fixes overflow, gaps and underfill |
| 4 QC | The Inspector (`ep-inspector`) | quotes verified, meanings and levels checked |
| 5 Bank | you | `python scripts/vocab_bank.py <spec> --bank "<outputs>/Treasure Chest"` |

The dossier is not required; this mode reads the paper itself (language lives in sentences, not summaries).

## Mode rules (validator enforced)
- Every entry is C1 or C2, has a type, a meaning (at most 22 words), a **verbatim** `context` line from the paper with its `page`, 2 to 4 `alternatives`, and an original `example` (at most 34 words) set in Applied Linguistics or academic life that uses the expression.
- Test each alternative in the quoted sentence for grammar, register and hedging strength. Qualify any alternative that changes the force of the claim. Treat the CEFR level as an editorial estimate unless a sense-specific source verifies it.
- Be picky. No B2 words, no field jargon (that is the glossary's job), no one-off coinages, no duplicates of what is already in the Treasure Chest (check it).
- Sheets must be at least 85% filled with no blank bands (the layout check). If space is left, add the quiz rather than padding entries.
- Fonts: EB Garamond (headwords), EB Garamond Italic (in context), Syncopate (wide labels), Michroma (numbers), Exo 2 (body), Allura (script). Theme: `assets/theme.css`.

## References
| File | Use |
|---|---|
| `references/selection-criteria.md` | What counts as treasure, the scoring rubric, the categories, the reject list |
| `references/entry-anatomy.md` | How to write each field (meaning, alternatives, example, type labels) |
| `references/pipeline.md` | Step-by-step with persona briefs |
| `references/layout-template.md` | Sheet structure and fitting rules |
| `references/glossary.md` | Mode terms |
| `assets/skeleton.spec.json` | Starter spec |

## Worked examples

Consult the recovered Markdown for this mode when you need an example of scope, structure and tone.

- [Ibrahim approved output](examples/ai-plagiarism.md)
- [Lund approved output](examples/ai-publishing.md)
- [Johnson approved output](examples/mixed-methods.md)
