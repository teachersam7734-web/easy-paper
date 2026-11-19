# Page layout: defects, checks and fixes

Every Easy Paper PDF must be clean: nothing overlaps, nothing is clipped, nothing trespasses into another section, the header or the footer, and no page is emptier than it should be. Three tools enforce this, and a human-eye pass finishes it.

| Layer | Tool | Catches |
|---|---|---|
| Before render | `validate.py` (also the PostToolUse hook) | Over-long text that will not fit: paragraphs over 95 words, short answers over 45, say-it lines over 25, long mind-map leaves, wrong counts |
| During render | `assets/js/layout.js` | Sheet overflow (fixed pages), unknown blocks, mind-map connector drawing |
| After render | `layout_check.py` (run automatically by render.py) | TRESPASS, OVERLAP, UNDERFILL, GAP, LASTPAGE, ORPHAN, TINY |
| Eyes | `pdftoppm -r 70 -png` and look | Awkward breaks, unbalanced columns, cramped diagrams, visual monotony |

The **Layout Doctor** (`ep-layout`) owns this file. The Designer runs it first; the Inspector re-checks it.

## Defect catalogue and fixes

| Code | What it means | First fix | If that fails |
|---|---|---|---|
| **OVERFLOW** | Content is taller than a fixed sheet (Review Guide, Vocab Treasure) | Cut the lowest-value item (exam weight, treasure score); shorten text to its core | Move a block to the next sheet; switch a table to `compact`; turn bullets into a 2-column `columns` block |
| **TRESPASS** | Text inside the top or bottom margin (where the footer lives) or outside the side margins | Usually an over-wide table or a long unbreakable string (URL, DOI): add `widths`, shorten the cell, or break the URL | Move the item into a `sources` block (wraps), or reduce the number of columns |
| **OVERLAP** | Two pieces of text drawn on top of each other (diagram labels, cycle nodes, mind-map cards) | Shorten labels (cycle node text at most 8 words; mind-map leaves at most 8 words) | Fewer nodes or branches; switch a `cycle` to a `pipeline` |
| **UNDERFILL** | A page under 72% full (flowing modes), or a sheet under 85% full (Review Guide, Vocab Treasure) | A big unbreakable block (table, card, chunk) was pushed to the next page. Move a smaller block above it, or split the big block (a long table into two, a chunk's visual after its text) | Re-order chunks; for sheets, add the next-highest-value item or the quiz. Never pad with filler |
| **GAP** | A blank band of more than 38 mm inside a page | Remove forced breaks (`new_page`, `page_break`, `spacer`) | Rebalance columns so both end level |
| **LASTPAGE** | The last page holds only a few lines | Tighten earlier pages (cut a glossary row, a quiz item above the minimum, an extra bullet) so the tail pulls back | Add a valuable block (a Memory Link, an extra Q&A) to fill at least half the page |
| **ORPHAN** | A heading stranded at the bottom of a page, its content on the next | Move the block or shorten the content above | Add `new_page: true` to that section, then fix the gap it leaves |
| **TINY** | Running text under 6.5 pt | Restore the theme size; cut words instead | (Letter-spaced ALL-CAPS labels are exempt) |
| **PAGE BUDGET** | Page count outside the mode's range | Cut low-value content (over) or add the next-highest-value content (under) | Never change fonts or margins to cheat the budget |

## Things the checkers cannot see (look for them)
- **Unbalanced columns:** one column ends 40 mm lower than the other. Move a card.
- **Monotony:** three pages in a row with the same visual type. Vary pipeline, table, cards, compare, timeline.
- **Visual-text mismatch:** a diagram that does not say what the text says, or that repeats it.
- **Break inside a story:** a chunk's short answer on one page and its body on the next. Pull it together or start the chunk on the next page.
- **Cramped diagrams:** labels touching borders, arrows crossing text.
- **Contrast:** light text on light tints, gold on cream. Every theme keeps body text dark on light (or light on dark in Vocab Treasure).

## House rules
1. Fix with structure first (move, split, reorder, columns), wording second (shorten), deletion last (only low-value content).
2. Never shrink fonts, margins or line height below the theme, and never add filler to hide empty space.
3. Every fix ends with a re-render and a look at the pages. "render.py prints OK" plus "every page looks right" is the definition of done.
