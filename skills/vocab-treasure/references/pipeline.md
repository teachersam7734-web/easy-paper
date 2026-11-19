# Vocab Treasure pipeline

`<ws>` is the workspace; `CORE` is `../easy-paper-core`.

## Stage 0. Intake
`python CORE/scripts/extract_paper.py <paper> --out <ws>`. Note the page count N. Target sheets = min(2, max(1, round(N/10))). Target entries = 8 to 10 per sheet (7 at least, if the paper is poor in treasure).

## Stage 1. The Lexicographer
Spawn `ep-lexicographer`:
> Workspace `<ws>`. Read vocab-treasure/references/selection-criteria.md and entry-anatomy.md. If `<outputs>/Treasure Chest/treasure-chest.csv` exists, read it and skip anything already banked. Read paper.txt fully and list 25 to 40 candidates, each with the exact context line and page, and score them (reusability, level, precision payoff, risk of misuse). Keep the best (score 10 or more; 8 to 10 per target sheet; no more than 3 of one type per sheet), choose one feature entry per sheet, and write every field per entry-anatomy.md. Add 2 to 3 quiz items using kept entries. Write `<ws>/vocab.md` with the candidate table, the final entries as JSON items, and the quiz.

## Stage 2. The Designer
Spawn `ep-designer`:
> Build `<ws>/vocab-treasure.spec.json` from vocab.md using vocab-treasure/references/layout-template.md (meta.cover "none"; one `sheet` per target page; each sheet starts with a `vt_strip`). Render with CORE/scripts/render.py and fix everything it reports, including OVERFLOW, UNDERFILL, GAP and PAGE BUDGET (move an entry between sheets, drop the weakest entry, add or remove the quiz). Look at the page images.

## Stage 3. The Layout Doctor
Spawn `ep-layout` if render.py still reports LAYOUT or OVERFLOW problems after the Designer's pass.

## Stage 4. The Inspector
> Run check_quotes.py (every `context` must be verbatim and on its page), validate.py and layout_check.py. Check each level (C1/C2) and meaning for accuracy, and each example for natural, idiomatic use. Write qc-report.md.

## Stage 5. Bank it
`python CORE/scripts/vocab_bank.py <ws>/vocab-treasure.spec.json --bank "<outputs>/Treasure Chest"` appends the entries to `treasure-chest.csv` and `treasure-chest.md` (deduplicated by term, with the source citation).
