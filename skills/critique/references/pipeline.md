# Critique Notes pipeline (step by step)

`<ws>` is the workspace, and `CORE` is `../easy-paper-core`. The main reference is `cc-specialist/` (read `cc-specialist/mindset.md` before Stage 2).

## Stage 0. Intake (you)
Extract with `CORE/scripts/extract_paper.py`. Reuse `dossier.md` if it exists.

## Stage 1. The Analyst (dossier and summary beats)
Spawn `ep-analyst`:
> Workspace `<ws>`. If dossier.md is missing, build it with CORE/references/dossier-template.md, paying special attention to §3 (contract), §12 (evidence log, at least 8 + and 8 -) and §13 (searchable absences). Then write `analyst.md` with critique-mode summary beats: a 1-sentence message; 4 to 5 gold nuggets; and 3 to 4 Hunt Questions that tell the paper neutrally in its own order ("What problem do they tackle?", "What did they do?", "What do they find or argue?", "How do they conclude?"). Each one gets a short answer (at most 45 words), 60 to 140 plain words of explanation, a suggested visual, and pages. No evaluation in the summary beats.

## Stage 2. The Judge
Spawn `ep-judge`:
> Workspace `<ws>`. Read critique/references/cc-specialist/mindset.md, then run cc-specialist/pipeline.md steps 1 and 4 to 9 on dossier.md and paper.txt: genre and yardstick, contract, evidence log, interrogation (brainstorm-bank.md sections 1 to 4), absence verification (grep paper.txt for each "they do not" item plus two synonyms, and log the result), fairness filter, ranking. Write `judge.md`: the yardstick in one line; a one-breath verdict (at most 25 words); five 1-to-5 ratings per cc-adaptation.md; 3 to 4 strengths (Feature, Anchor with page, Effect); 3 to 5 weaknesses (Claim, Evidence that credits the authors first, with page, Consequence for the paper's own aim, Alternative, severity); a fairness log; and 2 to 3 rejected candidate points with the reason (for the user's learning).

## Stage 3. The Coach
Spawn `ep-coach`:
> Read judge.md, analyst.md, critique/references/cc-adaptation.md and oral-phrasebank.md. For every strength and weakness, write a short memorable title (2 to 6 words) and a say-it line (at most 25 words, spoken register). Write: the 90-second oral script (8 to 12 lines: what it is, about 25 s; 2 strengths, about 25 s; the top 2 to 3 weaknesses, about 30 s; verdict, about 10 s); 5 to 6 examiner follow-up questions with model answers that lead with the answer (include "What would you change?", "Is it still relevant?" and "How does it relate to X theory?" using CORE/references/field-map.md); and a memory hook for the order of the points. Save coach.md.

## Stage 4. The Quizmaster (parallel with Stage 3)
Spawn `ep-quizmaster`:
> Read dossier.md and judge.md (not coach.md, which may not exist yet; the Designer matches card titles). 4 to 5 preview questions (one on the message, one on the method, two on strengths or weaknesses). A quiz of 8 to 10 items, at least 4 of them on critique ("Which is the paper's most serious limitation and why?", "Which fix addresses weakness 2?"). Write quiz.md.

## Stage 5. The Designer
Spawn `ep-designer` (with the paper's `memory-links.md` if present; use the critique-order hook):
> Build `<ws>/critique.spec.json` with critique/references/layout-template.md. Render and fix all problems. View the pages. 3 to 5 pages.

## Stage 5b. Layout
If render.py still reports LAYOUT, OVERFLOW or PAGE BUDGET problems, spawn `ep-layout`.

## Stage 6. The Inspector
Spawn `ep-inspector`:
> Apply CORE/references/qc-rubric.md with the fairness extra: re-run the absence searches for every weakness that claims something is missing, confirm each anchor's page, and confirm that ratings and cards agree. Write qc-report.md. Allow at most 2 FIX loops.

## Stage 6b. ADHD QC (if requested)
Run `adhd-student` job 3 (ADHD Auditor + Distracted Reader) on the PDF; adjust and re-render.

## Stage 7. Deliver
`<Short Title> - Critique.pdf`.
