# Deep Dive pipeline (step by step)

Paths: `<ws>` is the workspace `Easy Paper Outputs/<paper-slug>/`, and `CORE` is `../easy-paper-core` (`${CLAUDE_PLUGIN_ROOT}/skills/easy-paper-core` in the plugin).

## Stage 0. Intake (you)
1. Create `<ws>`. Run `python CORE/scripts/extract_paper.py <paper> --out <ws>`.
2. Read `paper-meta.json`. Note the PDF page count `N`, the printed offset, and any scanned warning.
3. Page budget = 5 to min(10, max(5, floor(N/2))). Write it down for the Designer.
4. If `<ws>/dossier.md` exists from another mode, skip the dossier part of Stage 1.

## Stage 1. The Analyst (about 80% of the content)
Spawn `ep-analyst` (or take on the persona) with this brief:
> Workspace: `<ws>`. Read `paper.txt` in full. (1) Build `dossier.md` with CORE/references/dossier-template.md. (2) Write `analyst.md` for a Deep Dive: a 1-sentence message; 5 to 7 gold nuggets (scored with gold-nugget-method.md); a roadmap of the paper's logic as 4 to 6 steps; then 5 to 8 Hunt Questions in the order a presenter would explain the paper. For each Hunt Question give: id, question (a real question ending with ?), pages, a short answer of at most 45 words, an explanation of 150 to 300 plain words, the canonical definitions involved (verbatim, with printed page, only where canonical), one concrete example, a suggested visual (block type plus its content), and one "watch out" confusion if one exists. Add one `link` connection to SLA theory using CORE/references/field-map.md (label it outside the paper). Use printed page numbers. Do not evaluate the paper except in a short "authors' own limitations" list.

**Good Hunt Questions** follow the presenter's arc:
1. Why does this paper exist? (the problem and gap)
2. What exactly are they asking or claiming? (purpose, RQs, thesis)
3. How did they do it? (method, or method of argument)
4. 1 to 3 questions on the core content (the centre of gravity: the framework, the findings, the definition)
5. What does it mean? (implications, the authors' conclusion)
6. Where does it stop? (the authors' own limits)

## Stage 2. The Scout (about 20% of the content, in parallel with Stage 1)
Spawn `ep-scout` with:
> Workspace: `<ws>`. Read the abstract, introduction, discussion and conclusion in `paper.txt` first. Read `dossier.md` (sections 7, 9, 12, 13) if it exists when you start; do not wait for it. Follow `deep-dive/references/scout-protocol.md`. Write `scout.md`: 3 to 5 gaps or shortcomings (each with why it matters); 4 to 8 newer works (prefer the last 5 years), each verified with a DOI or publisher URL, each tagged extends / challenges / replicates / updates / fills-gap, each with a 1 to 2 sentence so-what; and APA 7 references. Exclude anything you could not verify.

## Stage 3. The Coach (presenter kit)
Spawn `ep-coach` with:
> Read `analyst.md` and `scout.md`. Follow `deep-dive/references/presenter-kit.md`. Write `coach.md`: a 60-second talk track (6 to 9 spoken lines); 5 to 6 likely professor or peer questions with model answers that lead with the answer (at least 2 about weaknesses or newer evidence, using scout.md); and one "if you blank" recovery line.

## Stage 4. The Quizmaster
Spawn `ep-quizmaster` with:
> Read `dossier.md` and `analyst.md`. Follow CORE/references/quiz-design.md for Deep Dive: 5 to 6 preview questions mapped to the Hunt Questions, and 10 to 12 quiz items. Write `quiz.md` as JSON-ready items.

## Stage 5. The Designer
Spawn `ep-designer` with:
> Build `<ws>/deep-dive.spec.json` with `deep-dive/references/layout-template.md` and CORE/references/spec-schema.md from analyst.md, scout.md, coach.md and quiz.md. Set meta.paper.pages to N. Render with CORE/scripts/render.py and fix every problem it reports. Rasterise the pages (`pdftoppm -r 60 -png`), view each one, and fix orphan headings, half-empty pages and cramped diagrams. Hit the page budget by cutting the lowest-value content (gold-nugget scores), never by shrinking type.

## Stage 5b. Memory Links and layout
Paste the relevant blocks from `memory-links.md` (from `ep-memory-linker`) into the chunks that hold typologies or heavy definitions. Re-render after changing any block so the PDF matches the final spec. If render.py reports LAYOUT, OVERFLOW or PAGE BUDGET problems the Designer cannot clear, spawn `ep-layout`.

## Stage 6. The Inspector
Spawn `ep-inspector` with:
> You did not write this. Apply CORE/references/qc-rubric.md to `<ws>/deep-dive.spec.json`, its PDF and `<ws>/paper.txt` (15 fact checks for Deep Dive). Also verify that each Scout reference exists (search by title or DOI). Write `<ws>/qc-report.md`.
If the verdict is FIX, send the fix list to the Designer (or the owning persona for content). Re-render and re-inspect, at most 2 loops.

## Stage 6b. ADHD QC (if requested)
Run `adhd-student` job 3 (ADHD Auditor + Distracted Reader) and adjust.

## Stage 7. Deliver
Copy the PDF to `<ws>/<Short Title> - Deep Dive.pdf`. Tell the user in one line what it is, its page count, and the one thing to look at first.
