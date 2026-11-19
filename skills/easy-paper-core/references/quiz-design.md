# Preview Questions and Wrap-Up Quiz

## Preview Questions (before the content)

Purpose: the pretesting effect. Guessing first, even wrongly, makes the later answer stick and turns reading into a hunt.
- 3 to 6 questions. Deep Dive 5 to 6, Critique 4 to 5, Review Guide 4.
- Each one maps to a Hunt Question or must-know, in the same order, so the reader meets its answer soon.
- Phrase them so a guess is possible: "Why would asking 36 experts beat reading the literature?" works, "What is on p. 118?" does not.
- At least one asks about the authors' message, one about a key construct, and one about a limitation or "so what".
- Plain words, at most 14 words each (they sit in a two-column grid).

## Wrap-Up Quiz (after the content)

Purpose: retrieval practice, which is the single strongest memory tool.

**Size:** Deep Dive 10 to 12, Critique 8 to 10, Review Guide 8.

**Mix** (following the ADHD system's quiz order):
1. **Definitions and terminology** (2 to 3): the canonical terms, as mcq or short answer.
2. **Who argued or found what** (2 to 3): claims, findings, numbers that matter.
3. **Application** (2 to 3): apply a concept to a concrete learner, classroom or study (type `apply`).
4. **Critique or connection** (2 to 3): a limitation, a fair weakness, or a link to an SLA theory (Critique mode leans heavily here).

**Item rules:**
- `mcq` gets 3 or 4 options. Distractors are real confusions: neighbouring constructs, the paper's other numbers, a rival theory's claim. Never "all of the above" or joke options.
- `tf` is used sparingly (at most 2), and only for common misconceptions.
- `short` and `apply` give a model answer in at most 25 words.
- `fill` is a gap-fill (`______` in the question, the missing words as the answer); used mainly in Vocab Treasure.
- Every item has `answer` (for mcq the letter and the text, e.g. "B. 19 definitions") and `why` (one line ending with a page anchor `[p. 118]`).
- No trivia. If knowing it would not help in class or in an exam, cut it.
- Do not reuse a Preview Question word for word. Ask the same idea from a different angle.

**Spec format:**
```json
{"type":"quiz","title":"Wrap-up quiz","items":[
  {"q":"How many definitions did the authors analyse?","type":"mcq","options":["12","19","36","21"],"answer":"B. 19","why":"36 leaders were asked; 19 definitions came back [p. 118]."},
  {"q":"A teacher-researcher interviews 6 learners, then surveys 200. Which design is this?","type":"apply","answer":"Exploratory sequential (QUAL then QUAN).","why":"Sequence plus priority labels [p. 124]."}
]}
```
The renderer prints the answer key automatically on the last page.
