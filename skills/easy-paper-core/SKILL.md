---
name: easy-paper-core
description: "Shared engine and field expertise for the Easy Paper plugin, which turns an Applied Linguistics, SLA, TEFL or L2 acquisition paper (MA/PhD level) into ADHD-friendly study PDFs. Use it whenever a user uploads or names a paper and wants it explained, critiqued, summarized for an exam, presented, mined for vocabulary, or turned into study notes, and has not picked a mode yet. It routes to the four mode skills (deep-dive, critique, review-guide, vocab-treasure) and the adhd-student companion, and holds the shared dossier, personas, field library, renderer, fonts, validator, layout checker and QC tools."
---

# Easy Paper: core

Easy Paper reads one paper and gives back study PDFs for a reader with ADHD and a short attention span. Deep Dive, Critique and Review Guide follow this structure. Vocab Treasure follows its own card, footer and optional quiz rules.

- puts the **gold nuggets first**, before any detail,
- is cut into **chunks**, and each chunk answers one **Hunt Question**,
- opens with **Preview Questions** and closes with a **Wrap-Up Quiz** (answer key at the end),
- explains **what the authors are trying to say** in plain words, and quotes verbatim only where the wording itself matters (canonical definitions, named constructs, the thesis sentence).

## Route to a mode

| The user says or needs | Mode skill | Output |
|---|---|---|
| "I have to present this", high stakes, no time pressure, "explain it properly" | `deep-dive` | 5 to 10 pages (at most half the paper's length) |
| "critique", "critical commentary", "strengths and weaknesses", oral exam, viva, seminar discussion | `critique` | 3 to 5 pages of speakable critique notes |
| "exam tomorrow", "cram", "I only have 2 hours", "haven't read it", "summary" | `review-guide` | exactly 4 pages, mind map on page 1 |
| "vocabulary", "phrases", "collocations", "academic language to reuse" | `vocab-treasure` | 1 to 2 cinematic pages (about 1 per 10 pages of article) |
| "all", "the full pack" | run all four, sharing one dossier | 4 PDFs |
| "how do I study this", "study buddy", "memorize", "ADHD QC" | `adhd-student` | a guided session, Memory Links, or an ADHD QC report |
| "interactive HTML", "Mord’Sith", "Agiel", "Confessor", "Seeker" | `easy-paper-mordsith` in the full plugin | one offline HTML app built from all four ADHD-QC-passed modes |

The **master prompt** (`references/master-prompt.md`) lets the user choose modes, ADHD QC, and an interactive application in one go.

If the mode is unclear, ask one question with these four options (use AskUserQuestion when you have it). If nobody can answer, choose by urgency: exam within 48 hours means review-guide, a presentation means deep-dive, and otherwise deep-dive.

## Shared workflow (every mode)

1. **Workspace.** Make `Easy Paper Outputs/<paper-slug>/` next to the paper (or in the working directory). Keep all intermediate files there so a second mode can reuse them.
2. **Extract.** Run `python scripts/extract_paper.py <paper> --out <workspace>`. This writes `paper.txt` with `===== [PDF p.N | printed p.M] =====` markers, plus `paper-meta.json`. Check the inferred printed page offset against the visible page labels before citing. If printed pagination is unavailable, identify PDF page numbers explicitly. For unpaginated text use a verifiable section or paragraph locator in working notes and request a paginated source if a required output field needs a page number. If the meta says the PDF is scanned, rasterise the pages and read them as images.
3. **Dossier.** For Deep Dive, Critique and Review Guide, reuse an existing dossier only after confirming it describes the same source and edition. Vocab Treasure works directly from paper.txt. If it doesn't, the Analyst persona builds it with `references/dossier-template.md`. Check disputed facts against the original source.
4. **Field lens.** Use `references/field-map.md` to pick the 1 to 3 field reference files (figures and landmark papers) that this paper builds on or argues with, then read them. They give you correct background, lineage and critique angles. Anything you take from them, rather than from the paper, goes in an `outside` callout.
5. **Mode pipeline.** Follow the mode skill's `references/pipeline.md`. Personas are defined in `references/persona-system.md`.
6. **Memory Links.** Before building a study guide, create or reuse memory-links.md for typologies, lists or heavy definitions. Give the Designer the relevant links. Keep the formal definition alongside its memory aid.
7. **Spec, then render.** The Designer persona writes `<workspace>/<mode>.spec.json` following `references/spec-schema.md` and the mode's `references/layout-template.md`, then runs `python scripts/render.py <workspace>/<mode>.spec.json`. The renderer validates the spec, embeds the mode's fonts and theme, draws the mind maps, and checks the page budget and overflow. Exit code 2 means something must be fixed; fix it and render again.
8. **Layout.** render.py runs `scripts/layout_check.py` automatically (overlap, trespass into margins and footer, underfill and empty space, blank bands, orphaned headings, tiny text). Fix everything with `references/page-layout.md`; the Layout Doctor (`ep-layout`) takes over if the Designer cannot.
9. **QC.** The Inspector persona runs `references/qc-rubric.md`, which includes `python scripts/check_quotes.py <spec> <workspace>/paper.txt` and a page-by-page visual check of the rendered PDF (`pdftoppm -r 70 -png`). It sends fixes back to the Designer, for at most two loops.
10. **ADHD QC (when requested).** `adhd-student` runs the ADHD Auditor and the Distracted Reader on the PDF and adjusts it before delivery.
11. **Deliver** the PDF with one line of context. Name the PDF `<Short Title> - <Mode>.pdf`.

## Subagents or personas?

- **Agentic tool (Claude Code, Cowork, Agent SDK) with an Agent/Task tool:** spawn the plugin agents (`ep-analyst`, `ep-scout`, `ep-judge`, `ep-coach`, `ep-distiller`, `ep-lexicographer`, `ep-quizmaster`, `ep-memory-linker`, `ep-designer`, `ep-layout`, `ep-inspector`, `ep-adhd-auditor`, `ep-distracted-reader`; `ep-improver` maintains the plugin itself) as the mode pipeline says. Give each one the workspace path and the files it must read and write. Run independent ones in parallel (for example, the Analyst and the Scout in Deep Dive), but **never more than 3 subagents at a time**; queue the rest and start the next when one finishes (this protects the user's usage limits).
- **No subagents** (claude.ai web chat, any tool without an Agent tool): run the same pipeline yourself as **one unified agent with multiple personalities**. Take on each persona in order, using its card in `references/persona-system.md`. Write each persona's artifact to its own file before switching, so each stage starts from files and not from memory, and re-read the persona card at each switch. The output is the same; only the parallelism is lost.
- **No code execution at all:** write the spec, then hand-write HTML using the class names in `assets/css/base.css`, and tell the user to print it to PDF. Say this plainly.

## Non-negotiables

- Never invent a quote, number, page, author, year, study or citation. Unverified means it is left out, or marked `[p. ?]` / "(unverified)".
- Verbatim only where the wording matters. Use printed pages where available and explicit PDF page indices when the source has no printed page numbers. Paraphrase the rest.
- Writing rules are in `references/writing-rules.md`: plain words, short sentences, no em or en dashes, no exclamation marks, no AI-tell words. The validator enforces the mechanical ones.
- The ADHD design rules in `references/adhd-learning-design.md` apply to every page.
- Branding: the byline "By: Sajjad Irani" appears on the cover and in the footer (set `meta.byline`; change it only if the user asks). There are no logos.
- English output.
- Counts (chunks, preview and quiz items, nuggets, cards, entries) come from the `LIMITS` table in `scripts/validate.py`, the single source of truth that every layout template follows.

## Reference map

| File | Use it for |
|---|---|
| `references/adhd-learning-design.md` | The learning-science rules every page follows |
| `references/gold-nugget-method.md` | Finding the author's message, the 20% that carries 80%, and when to quote verbatim |
| `references/dossier-template.md` | The shared paper dossier the Analyst builds |
| `references/paper-genres.md` | Identify the genre and what to extract or judge for it |
| `references/persona-system.md` | The eight personas: role, pantheon, what great means, anti-examples, hand-offs |
| `references/field-map.md` | Schools of thought, keyword triggers, and which field file to open |
| `references/field/figures/*.md` | 10 prominent researchers (Krashen, Long, Swain, Schmidt, R. Ellis, Lantolf, Larsen-Freeman, Dörnyei, Lyster, Plonsky) |
| `references/field/papers/*.md` | 10 landmark papers (Canale & Swain 1980 to Dörnyei 2009) |
| `references/al-glossary.md` | Plain-language glossary of core Applied Linguistics terms |
| `references/quiz-design.md` | Preview Questions and Wrap-Up Quiz design |
| `references/writing-rules.md` | Voice, plain-language and mechanical rules |
| `references/spec-schema.md` | Every block type the renderer accepts, with JSON examples |
| `references/qc-rubric.md` | The Inspector's checklist and scoring |
| `references/page-layout.md` | Layout defects (overlap, trespass, underfill, gaps, orphans) and their fixes |
| `references/master-prompt.md` | The one-shot master prompt: choose modes, ADHD QC, interactive app |
| `scripts/layout_check.py` | Post-render layout checker (run by render.py) |
| `scripts/vocab_bank.py` | Appends Vocab Treasure entries to the cumulative Treasure Chest |
| `scripts/extract_paper.py` | Paper to page-marked text |
| `scripts/render.py` | Spec to PDF (runs the validator, page budget and overflow checks) |
| `scripts/validate.py` | Spec checks alone (also run by the plugin hook) |
| `scripts/check_quotes.py` | Verify verbatim quotes and their pages against the paper |
| `assets/fonts/` | Sora, Space Grotesk, Outfit, Inter, JetBrains Mono, EB Garamond (OFL) |
| `assets/css/base.css`, `assets/js/layout.js`, `assets/icons/` | The design system, mind-map drawing, Lucide icons (ISC) |
