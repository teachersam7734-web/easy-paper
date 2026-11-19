# Review Guide pipeline

`<ws>` is the workspace; `CORE` is `../easy-paper-core`.

## Stage 0. Intake
Extract with `CORE/scripts/extract_paper.py`. Reuse `dossier.md` if present.

## Stage 1. The Analyst
Spawn `ep-analyst` (dossier only; this mode has no analyst.md):
> Build dossier.md with CORE/references/dossier-template.md. §5 (constructs and verbatim definitions), §7 (findings with numbers) and §10 (scored candidate nuggets) must be complete, because the Distiller depends on them.

## Stage 2. The Distiller
Spawn `ep-distiller`:
> Workspace `<ws>`. Read dossier.md, review-guide/references/eighty-twenty.md, mindmap-rules.md and memory-hooks.md. Write distiller.md:
> 1. **The one thing** (at most 30 words): the paper's message.
> 2. **Mind map**: centre label (at most 4 words) + a 6 to 10 word subline; 5 to 7 branches, each with an icon, a label (1 to 3 words) and 2 to 4 leaves (each at most 8 words), following the paper's logic.
> 3. **Gold nuggets** (3 to 5).
> 4. **Must-knows**: 6 to 9 items ranked by exam weight. Each gets: stars (3, 2 or 1), a Hunt Question, a short answer (at most 35 words), a body of 40 to 110 words, a verbatim definition if canonical (with page), a suggested compact visual, and a memory hook.
> 5. **Numbers worth memorising** (3 to 6, each with its meaning and page).
> 6. **Don't mix these up**: 2 to 3 contrasts.
> 7. **Likely exam questions**: 4 to 5 with model answers of 2 to 3 sentences (definition, explain, apply, evaluate).
> 8. **2-hour game plan** (120 min total) for a reader starting from zero.
> 9. **Cut list**: what you left out and why (internal only, not printed).

## Stage 3. The Quizmaster
Spawn `ep-quizmaster`:
> Read dossier.md and distiller.md. 4 preview questions (one per sheet-2/3 must-know cluster). 8 quiz items: 2 definition, 2 finding or claim, 2 apply, 2 critique or connect. Write quiz.md.

## Stage 3b. Memory Links
If the paper has typologies or lists, spawn `ep-memory-linker` (or reuse `memory-links.md`). Hooks go in the page-3 memory-hook cards.

## Stage 4. The Designer
Spawn `ep-designer`:
> Build review-guide.spec.json with review-guide/references/layout-template.md: meta.cover "compact" and exactly 4 top-level `sheet` blocks. Render; fix overflow by cutting the lowest-weight content first; view all 4 pages.

## Stage 4b. Layout
If problems remain after the Designer, spawn `ep-layout`. Every sheet must be at least 85% filled with no overflow.

## Stage 5. The Inspector
Spawn `ep-inspector`:
> Apply CORE/references/qc-rubric.md. Extra checks: (a) could someone who never read the paper answer every quiz item from these 4 pages alone? (b) Are the 3-star items really the most testable? (c) Is the mind map legible at arm's length? Write qc-report.md. Allow at most 2 FIX loops.

## Stage 5b. ADHD QC (if requested)
Run `adhd-student` job 3 and adjust.

## Deliver
`<Short Title> - Review Guide.pdf`.
