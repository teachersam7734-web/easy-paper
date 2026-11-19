---
name: deep-dive
description: Easy Paper's Deep Dive mode. It turns an Applied Linguistics, SLA, TEFL or L2 acquisition paper into a 5 to 10 page ADHD-friendly PDF (at most half the paper's length) that explains every important concept in very simple, structured language, so the student can present the paper to a professor and peers and answer their questions. It adds a researcher section on the paper's gaps and newer studies. Use when the user must present or teach a paper, the stakes are high, there is no time pressure, or they ask for a deep dive, a full explanation, a presentation handout or mastery of a paper.
---

# Deep Dive

**Who it is for:** a student who must stand up and explain this paper and handle questions. They have time and want real command of it, not a skim.
**What they get:** a 5 to 10 page PDF (never more than half the original paper's page count). It opens with a mission, preview questions and gold nuggets. Then come 5 to 8 Hunt-Question chunks in simple language, each with a visual. A "Beyond the paper" section covers gaps and newer research, followed by a presenter kit (talk track and likely questions), a glossary, a Wrap-Up Quiz, and the answer key.
**Content split:** about 80% comes from the Analyst (the paper itself) and about 20% from the Scout (supplements and gaps).

Read first: `../easy-paper-core/SKILL.md` (shared workflow), then this mode's `references/pipeline.md`.

## Pipeline at a glance

| Stage | Persona / agent | Input | Output | Parallel? |
|---|---|---|---|---|
| 0 Intake | you | the paper | workspace, `paper.txt`, `paper-meta.json`, page budget | |
| 1 Analyse | The Analyst (`ep-analyst`) | `paper.txt` | `dossier.md`, `analyst.md` | runs alongside 2 |
| 2 Scout | The Scout (`ep-scout`) | `paper.txt` abstract and intro first, then `dossier.md` | `scout.md` | runs alongside 1 |
| 3 Presenter kit | The Coach (`ep-coach`) | `analyst.md`, `scout.md` | `coach.md` | runs alongside 4 |
| 4 Questions | The Quizmaster (`ep-quizmaster`) | `dossier.md`, `analyst.md` | `quiz.md` | runs alongside 3 |
| 5 Build | The Designer (`ep-designer`) | all of the above | `deep-dive.spec.json`, PDF | |
| 6 QC | The Inspector (`ep-inspector`) | spec, PDF, `paper.txt` | `qc-report.md`; loop to 5 if FIX (max 2) | |
| 7 Deliver | you | PDF | `<Short Title> - Deep Dive.pdf` | |

Without subagents, run the same stages yourself with the relay protocol in `../easy-paper-core/references/persona-system.md`.

## Quick commands
- Extract: `python3 ../easy-paper-core/scripts/extract_paper.py <paper> --out <ws>`
- Render: `python3 ../easy-paper-core/scripts/render.py <ws>/deep-dive.spec.json`
- Quotes: `python3 ../easy-paper-core/scripts/check_quotes.py <ws>/deep-dive.spec.json <ws>/paper.txt`
- Look: `pdftoppm -r 60 -png <pdf> <ws>/qc/dd`

In the plugin, `${CLAUDE_PLUGIN_ROOT}/skills/easy-paper-core/scripts/...` is the same path.

## Mode rules
- Page budget: 5 to 10 pages, and at most half the paper's pages (set `meta.paper.pages`). The renderer enforces this.
- Simplicity over completeness: explain the ideas a presenter needs, not every detail. If a detail would never be asked about in class, cut it.
- Each chunk: a Hunt Question, a short answer, a 150 to 300 word explanation in plain words, and at least one visual. Add a classroom or research example where it helps.
- At least one big diagram of the paper's logic or procedure (pipeline, cycle or mind map) near the start: the roadmap the presenter can put on a slide.
- The Scout's section has `role: "researcher"`. It holds gaps as `gap` callouts or a table, newer works as cards, and every work in a `sources` block with a DOI or URL. Anything not from the paper is labelled.
- The presenter kit holds a 60-second talk track (`script`) and 5 to 6 professor or peer questions with model answers (`qa`).
- Theme and fonts: `assets/theme.css` (cyan lead, gold highlights; Sora headings, Inter body, EB Garamond verbatim definitions).

## References
| File | Use |
|---|---|
| `references/pipeline.md` | Step-by-step procedure with each persona's exact brief |
| `references/layout-template.md` | The page-by-page skeleton and block order |
| `references/presenter-kit.md` | How the Coach builds the talk track and Q&A for presenting |
| `references/scout-protocol.md` | Search strategy, verification and gap types for the Scout |
| `references/glossary.md` | Deep Dive craft terms (roadmap, centre of gravity, gap types) |
| `assets/skeleton.spec.json` | A starter spec with every required block |
| `assets/theme.css` | Mode theme |

## Worked examples

Consult the recovered Markdown for this mode when you need an example of scope, structure and tone.

- [Ibrahim approved output](examples/ai-plagiarism.md)
- [Lund approved output](examples/ai-publishing.md)
- [Johnson approved output](examples/mixed-methods.md)
