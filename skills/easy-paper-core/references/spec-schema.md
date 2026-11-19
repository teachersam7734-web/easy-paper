# Easy Paper spec schema (input to scripts/render.py)

A spec is one JSON file: `{"meta": {...}, "blocks": [ ... ]}`. Blocks render in order. Containers (`section`, `chunk`, `sheet`, `callout`, `columns`, and `cards` items) take nested `blocks`. All text fields accept inline markup: `**bold**`, `*italic*`, `==highlight==`, `` `code` ``, `[p. 12]` / `[pp. 3-5]` / `[Table 2]` / `[Figure 1]` anchors, `{{keyword}}`.

## meta
```json
{"mode":"deep-dive",                 // deep-dive | critique | review-guide
 "byline":"Sajjad Irani",
 "kicker":"Case File 2 · Research methods",      // small line above the title
 "short_title":"Mixed Methods (Johnson et al., 2007)", // footer
 "cover":"full",                    // full | compact | none (review-guide uses compact)
 "cover_chips":[{"icon":"timer","text":"35 min read"},{"icon":"search","text":"6 hunt questions"}],
 "page_budget":[5,10],              // optional override; defaults: DD 5-10 (and at most half the paper), CR 3-5, RG 4
 "paper":{"title":"...","authors":"...","year":"2007","reference":"APA 7 reference","pages":22}}
```

## Block catalogue

| type | fields | use |
|---|---|---|
| `section` | title, kicker?, icon?, lead?, role? ("researcher" for Deep Dive's Scout section), new_page?, blocks | A titled part of the document |
| `h3` | text, icon? | Sub-heading inside a section or chunk |
| `p` | text, lead? | Paragraph, at most 95 words |
| `bullets` | items[], style: dot / check / num, title? | Lists |
| `mission` | name, goal, chips[{icon,text}] | Mission framing (top of the document) |
| `preview` | items[3-6], note? | Preview Questions |
| `nuggets` | items[3-7], title? | Gold nuggets |
| `chunk` | id ("HQ1"), question (ends with ?), answer (≤45 words), pages?, minutes?, icon?, blocks | Hunt-question chunk |
| `definition` | term, quote?, source ("Author, Year, p. N"), plain, verbatim (default true) | Canonical definition card; quotes are checked by check_quotes.py |
| `quote` | text, source, verbatim? | Pull quote (use rarely) |
| `callout` | tone: tip / warn / exam / say / outside / gap / nugget / key / time / link / parking, title?, text, blocks? | Side notes |
| `table` | title?, columns[], rows[[...]], widths[%]?, highlight_rows[i]?, note?, compact? | Tables |
| `pipeline` | title?, steps[{label,text,icon?}], direction: row / col, caption? | Processes, procedures, designs (2-6 steps in a row) |
| `cycle` | title?, center?, nodes[{label,text}] (3-6) | Circular logic or a framework |
| `mindmap` | center, sub?, branches[{label, icon?, color?, leaves[]}], height_mm? | Radial mind map (5-7 branches; leaves ≤8 words) |
| `cards` | cols 1-4, items[{title,text,icon?,tone: gold/cyan/pink/green/violet/ink,badge?,blocks?}] | Concept cards, memory hooks, must-knows |
| `compare` | title?, sides[{label,color?,icon?}], rows[{label, values[]}] | Side-by-side contrast |
| `timeline` | title?, items[{when, who, what}] | History, lineage |
| `stats` | items[{value,label}] (2-5) | Big numbers |
| `bars` | title?, items[{label,value,display?}], note? | Simple counts or percentages |
| `figure` | src (path) or svg, caption?, width? | Custom image or SVG |
| `verdict` | line, scores[{label,value 1-5}] | Critique verdict |
| `critique_card` | kind: strength / weakness, n, title, claim, anchor, why, fix (weakness), say, severity? (major / moderate / minor) | One critique point |
| `script` | title?, seconds?, lines[] | Speak-aloud script |
| `qa` | title?, icon?, items[{q,a}] | Likely questions with model answers |
| `glossary` | title?, items[{term,plain}] | Glossary grid |
| `studyplan` | title?, items[{min,task}] | Time-boxed plan (minutes auto-summed) |
| `scoreboard` | items[] | Self-score strip |
| `quiz` | title?, hint?, items[{q,type: mcq/tf/short/apply,options?,answer,why}] | Wrap-Up Quiz (answer key auto-added at the end) |
| `answer_key` | title? | Place the key yourself (otherwise it is auto-appended) |
| `sources` | title?, items[] | Reference list (APA 7) |
| `columns` | cols [[blocks],[blocks]], gap? | Two- or three-column layout |
| `sheet` | no, title, sub?, blocks | A fixed A4 page (Review Guide); overflow is reported |
| `page_break`, `spacer` (mm) | | Layout control |

## Icons
Lucide names available in `assets/icons/`: target, zap, book-open, flask-conical, scale, triangle-alert, circle-check, lightbulb, map, quote, users, chart-column, link, search, compass, mic, message-circle-question, puzzle, layers, route, list-checks, graduation-cap, brain, clock, gem, sparkles, shield-check, circle-x, thumbs-up, thumbs-down, microscope, file-text, network, timer, flag, eye, hammer, git-compare, trophy, key, bookmark, rocket.

## Minimal example
```json
{"meta":{"mode":"review-guide","cover":"compact","paper":{"title":"...","authors":"...","year":"2024","reference":"...","pages":15}},
 "blocks":[
  {"type":"sheet","no":1,"title":"The big picture","blocks":[
     {"type":"preview","items":["...","...","...","..."]},
     {"type":"mindmap","center":"...","branches":[{"label":"...","leaves":["..."]}]},
     {"type":"nuggets","items":["..."]}]},
  {"type":"sheet","no":2,"title":"...","blocks":[{"type":"chunk","question":"...?","answer":"...","blocks":[]}]},
  {"type":"sheet","no":3,"title":"...","blocks":[]},
  {"type":"sheet","no":4,"title":"...","blocks":[{"type":"studyplan","items":[]},{"type":"quiz","items":[]}]}]}
```

## Render
`python scripts/render.py <spec.json>` writes `<spec>.pdf` and `<spec>.html`, and prints problems (exit 2) for validator failures, page-budget misses and sheet overflow. Fix the content rather than shrinking fonts.
