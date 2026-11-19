# From Critical Commentary to Critique Notes

The user's CCs are excellent written critiques: summary, strengths, weaknesses, about 1,000 words of dense, hedged prose. They are hard to **say** and hard to **remember** in an oral exam: sentences are long, points blur into paragraphs, and the structure is invisible when you speak. Critique Notes keep the CC's judgment and change its form.

## What stays (non-negotiable, from the CC Specialist)
- Yardstick first: name the genre and judge the paper by its own job and its own promises.
- Exhibits, not impressions: every point has an anchor (page, table, number, quote, documented absence).
- Absence must be proven: search paper.txt for the item and two synonyms before claiming it is missing.
- Credit before critique: "Although they note X [p. n], they do not..."
- Internal consistency beats wish lists. Remedy or remove.
- Proportion: substance first, then structure, then style.
- The two final questions: would the authors recognise the summary, and would they accept the weaknesses as fair?

## What changes

| Written CC | Critique Notes | Why |
|---|---|---|
| 350 to 450 word neutral summary in prose | 3 to 4 Hunt-Question chunks ("What did they set out to do?", "How?", "What did they find or argue?"), each with a short answer and one visual | You recall a picture and three answers, not a paragraph |
| Strengths paragraph (FAE inside sentences) | 3 to 4 `critique_card`s: **The point** (Feature), **Proof in the paper** (Anchor), **Why it matters** (Effect), **Say it** line | Each point becomes a separate, retrievable unit |
| Weaknesses paragraph (CECA inside sentences) | 3 to 5 cards: The point (Claim), Proof in the paper (Evidence, crediting the authors first), Why it matters (Consequence for the paper's own aim), What would fix it (Alternative), Say it, severity tag | You can deliver one weakness at a time and stop whenever the examiner interrupts |
| Final verdict sentence | `verdict` block: a one-breath verdict + five 1-to-5 ratings | An instant overall answer to "So what do you think of it?" |
| Hedged, written register | Say-it lines in spoken register (at most 25 words, one idea, natural rhythm) | Fluency under pressure |
| None | 90-second oral `script` with signposts, examiner follow-ups (`qa`), memory hook for the order | Oral exam readiness |
| None | Preview Questions and Wrap-Up Quiz | Retrieval practice |

## Field mapping (Judge to Coach to Designer)

| Judge's field (judge.md) | Card field | Coach adds |
|---|---|---|
| Feature / Claim | `claim` (at most 25 words) | |
| Anchor / Evidence | `anchor` (page plus what is there; credit first for weaknesses) | |
| Effect / Consequence | `why` | |
| Alternative | `fix` (weaknesses only) | |
| | `say` | spoken line, at most 25 words |
| Rank / seriousness | `severity` major / moderate / minor (weaknesses) and order | |
| Short title | `title` (2 to 6 words, memorable: "Asks the field, not the authors") | |

## Ratings for the verdict (1 to 5 each)
Choose five that fit the genre:
- Empirical: Question, Design, Evidence, Transparency, Usefulness.
- Review: Coverage, Method, Balance, Currency, Usefulness.
- Conceptual or definitional: Clarity, Argument, Evidence, Originality, Usefulness.
Use whole numbers and never all 5s. The ratings must match the cards (several major weaknesses cannot sit beside a 5 for Design).

## If the user also wants the classic written CC
Use the copied CC Specialist files as they are (Workflow A in `cc-specialist/pipeline.md`), with `cc_lint.py`. That is a separate deliverable and not part of this PDF.
