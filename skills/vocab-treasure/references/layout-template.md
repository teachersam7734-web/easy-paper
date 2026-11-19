# Vocab Treasure layout template

Full-bleed A4 sheets (render.py prints this mode with zero page margins; each sheet draws its own footer).

```json
{"meta": {"mode": "vocab-treasure", "byline": "Sajjad Irani", "cover": "none",
          "paper": {"title": "...", "authors": "...", "year": "...", "reference": "APA 7", "pages": 22}},
 "blocks": [
  {"type": "sheet", "no": 1, "blocks": [
     {"type": "vt_strip", "reel": "REEL 01", "source": "Author (Year) · Short title",
      "stats": [{"value": "10", "label": "finds"}, {"value": "C1-C2", "label": "level"}, {"value": "3", "label": "to steal this week"}]},
     {"type": "vocab", "items": [ ... 8 to 11 entries, the first with "feature": true ... ]}]},
  {"type": "sheet", "no": 2, "blocks": [
     {"type": "vt_strip", "reel": "REEL 01 · II", "source": "...", "stats": []},
     {"type": "vocab", "items": [ ... ]},
     {"type": "quiz", "title": "Wrap-up quiz", "hint": "Fill the gap from memory.", "items": [ 2 to 3 ]}]}]}
```

Fitting rules
- With real context lines a sheet holds about 7 to 9 cards (1 feature + 6 to 8), or 1 to 2 fewer with a 2 to 3 item quiz. Wide (feature) cards take two slots. Long context lines and long examples take more room.
- If OVERFLOW: shorten `context` to the shortest clause (use `...`), drop `pattern` or `note`, or move the last entry to the next sheet.
- If UNDERFILL or GAP: add the quiz (2 to 3 items) to the last sheet first, then one more strong entry if one exists. Never add weak entries.
- An odd number of regular cards leaves a hole in the grid. Make it even, or let the quiz fill the space.
- The reel number counts papers in the booklet. If unknown, use REEL 01.
