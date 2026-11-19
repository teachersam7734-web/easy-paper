# Entry anatomy (spec `vocab` item)

```json
{"n": 1, "feature": true,
 "term": "lend credence to",
 "forms": ["lends credence to", "lent credence to"],
 "type": "collocation", "level": "C1",
 "pattern": "lend credence to + NP (a claim, view, idea)",
 "meaning": "make a claim or idea seem more believable.",
 "context": "<exact sentence or clause from the paper containing it>",
 "page": "p. 120",
 "alternatives": ["support", "corroborate", "bolster"],
 "example": "The interview data **lend credence to** the survey's main trend.",
 "note": "Formal; the subject is usually evidence or findings, not people."}
```

| Field | Rules |
|---|---|
| `term` | Dictionary form (base verb, singular). Slot fillers as `sb` / `sth` or `...`: *call sth into question* |
| `forms` | Inflected forms that appear in `context`, so the renderer highlights the right words |
| `type` | One label from selection-criteria.md |
| `level` | C1 or C2. Judge by reference corpora and your knowledge of learner writing; when unsure, C1 |
| `pattern` | Optional. The grammar frame or the typical collocates (*+ that-clause*, *with + NP*). Omit it when it would just repeat the term |
| `meaning` | Plain English, at most 22 words, with no circularity (do not define a word with itself) |
| `context` | **Verbatim** from the paper: the shortest complete clause that shows the use (12 to 35 words). Use `...` for elisions. Verified by check_quotes.py |
| `page` | `p. N` (printed) or `PDF p. N` |
| `alternatives` | 2 to 4 near-synonyms or rephrasings, from most to least similar. Note the register shift in `note` if one is less formal |
| `example` | An original sentence (at most 34 words) set in Applied Linguistics or academic life, with the expression in `**bold**`. It must sound like a real paper, not a textbook drill |
| `note` | Optional, at most 15 words: a usage warning (preposition, register, common mistake) |
| `feature` | Optional. Marks the single most valuable entry on the sheet, shown as a wide card |

## Quiz items (optional, 2 to 3, only if there is space)
- `fill` (gap-fill, labelled "Fill the gap"): `"q": "These findings ______ the claim that recasts are implicit."`, `"answer": "lend credence to"`.
- `mcq`: choose the right preposition or collocate.
- Each `why` gives a page anchor: `[p. 120]`.
