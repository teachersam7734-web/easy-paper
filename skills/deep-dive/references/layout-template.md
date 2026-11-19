# Deep Dive layout template

Flowing A4 pages, with the footer added by the renderer. The order is fixed so every Deep Dive feels the same.

| # | Block(s) | Content | Budget |
|---|---|---|---|
| 1 | cover (`meta.cover: "full"`) | kicker = case-file name + area; chips: read time, number of hunt questions, page anchors | top third of p.1 |
| 2 | `mission` | name ("Case File: ..."), goal ("Present this paper in 5 minutes and survive the Q&A") | 1 box |
| 3 | `preview` | 5 to 6 preview questions | 1 box |
| 4 | `nuggets` | 5 to 7 gold nuggets with anchors | 1 box |
| 5 | `section` "The paper in one picture" | 1 sentence message (`p` lead) + roadmap `pipeline` (4 to 6 steps) or `mindmap`; optional `stats` | about half a page |
| 6 | `chunk` × 5 to 8 | each: question, answer, pages, minutes; body = `p` and `bullets`, one visual (`table` / `compare` / `pipeline` / `cycle` / `timeline` / `cards` / `definition`), optional `callout` (warn / exam / link) | 0.6 to 1.2 pages each |
| 7 | `section` role `researcher` "Beyond the paper: gaps and newer work" | gap `table` or `gap` callouts; `cards` (cols 2) for newer works tagged extends / challenges / updates | about 1 page |
| 8 | `section` "Presenter kit" | `script` (60 s talk track) + `qa` (5 to 6) | about 0.7 page |
| 9 | `glossary` | 8 to 14 terms from the paper | about 0.4 page |
| 10 | `quiz` | 10 to 12 items | about 0.7 page |
| 11 | `scoreboard` (optional) + `sources` | the Scout's references (APA 7) and the main paper | short |
| 12 | answer key (auto) | | last page |

Rules:
- Chunk order follows the presenter's arc (pipeline.md, Stage 1).
- Use a `definition` block for each canonical definition, at most 4 in the document.
- Vary visuals across chunks; no two neighbouring chunks should use the same block type as their main visual.
- Use `new_page: true` only for the researcher section, and only if a page break avoids splitting its table.
- If you are over budget, cut in this order: optional stats, extra bullets, the lowest-scoring chunk, glossary rows, quiz items (keep at least 10).
