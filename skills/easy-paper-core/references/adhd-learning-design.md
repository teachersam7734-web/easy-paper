# ADHD learning design: the rules every Easy Paper page follows

Source base: the user's *ADHD-Friendly Study System for Applied Linguistics and SLA Reading* (sprints, hunt questions, mission names, blind recall, sparring, role cards, scoreboard, spaced review), plus well-established learning science: retrieval practice (Roediger & Karpicke, 2006), the pretesting effect (Richland, Kornell & Kao, 2009), cognitive load and segmenting (Sweller; Mayer's multimedia principles: signaling, segmenting, coherence, dual coding), elaborative interrogation, and spacing.

The ADHD system asks the reader to do a lot of work: 79 minutes per unit, prompts to paste, many technical sentences. Easy Paper turns that around. **It does the heavy extraction for the reader and keeps the active parts** (guess, hunt, recall, quiz) small and built into the page.

## 1. The reader

Smart, an MA/PhD student, easily distracted, often short of time. They remember the nuggets and forget the rest. Every design choice answers one question: *will this still be in their head tomorrow?*

## 2. The twelve page rules

1. **Nuggets before details.** Every document opens with 3 to 7 gold nuggets, and every chunk opens with a SHORT ANSWER line (under 45 words). If the reader stops after the first third of a page, they still got the point.
2. **One chunk, one Hunt Question.** A chunk is a question the reader would actually ask ("Why did they ask 36 people instead of reading the literature?"), never a topic label ("Method"). It ends with a question mark. 120 to 300 words of body, plus one visual.
3. **A visual in every chunk.** Use a table, pipeline, compare, cycle, timeline, stats, bars, cards, a mind map or a definition card. Turn lists of steps into pipelines, contrasts into compare blocks, and counts into stats or bars. Text-only chunks are the exception.
4. **Short everything.** Paragraphs under 95 words (validator enforced), sentences mostly under 22 words, bullets of 1 to 2 lines. White space is a feature.
5. **Signal, don't decorate.** Use bold for the 1 to 3 words per paragraph that carry the meaning, `==highlight==` for at most one phrase per chunk, and anchors `[p. 7]` so any claim can be found again in seconds. Icons label types of content (definition, warning, exam); they never just fill space.
6. **Message over wording.** Paraphrase what the authors are trying to say. Quote verbatim only for canonical definitions, named constructs, and the one sentence that states the thesis. Every quote gets a printed page.
7. **Preview Questions first** (pretesting effect). Ask 3 to 6 questions before the content and tell the reader to guess. Each one is answered in a chunk, ideally in the same order.
8. **Wrap-Up Quiz last** (retrieval practice). Mix question types, keep the answer key on the last page, and give each answer a page anchor. See `quiz-design.md`.
9. **Mission framing.** The cover or the first block names a mission ("Case File: Can AI catch AI?") and a concrete goal ("Explain the paper to your class in 5 minutes"). Stakes and novelty hold attention.
10. **Predictable layout.** The same furniture always sits in the same place, so the reader never has to figure out the page: mission, preview, nuggets, chunks, extras, quiz, key.
11. **Concrete before abstract.** Give a classroom, learner or study example within two sentences of every abstract idea.
12. **Make it a game, lightly.** A scoreboard strip (preview guesses right, quiz score), time chips on chunks ("4 min"), and "exam magnet" callouts give the reader small wins without turning the page into a toy.

## 3. What to cut

- Literature-review lists of "X (2019) found, Y (2020) found." Keep only the 1 or 2 studies the argument depends on.
- Statistical detail beyond the result that matters: keep the direction, the size and whether it was significant, and drop test assumptions unless they are criticized.
- Restating. If the nugget says it, the chunk adds the *how* or the *example*, not the same sentence again.
- Hedging chains and academic throat-clearing.

## 4. Built-in active learning (lightweight versions of the ADHD system)

| ADHD system element | How Easy Paper builds it in |
|---|---|
| Mission name | `mission` block or cover kicker |
| Hunt questions with page ranges | `chunk` blocks with `question`, `pages`, `minutes` |
| Keyword cluster from memory | The short-answer line plus `{{keyword}}` marks the reader can cover and recall |
| Blind recall | "Cover the page and explain" prompt inside the quiz or study plan |
| Sparring match / role cards | `qa` block: the questions a professor, peer or examiner will ask, with model answers |
| Connections to SLA theory | `link` / `outside` callouts that use the field references |
| Parking lot | optional `callout` with tone `parking` (Deep Dive, for print use) |
| Scoreboard | `scoreboard` block |
| Spaced review | the study plan's last line: "Tomorrow: redo the quiz from memory (5 min)" |

## 5. Mode-specific attention budgets

| Mode | Reader's state | Pages | Chunk size | Visual density |
|---|---|---|---|---|
| Deep Dive | Has time, must master it and present it | 5 to 10, at most half the paper | 200 to 300 words | 1 or 2 visuals per chunk |
| Critique | Must speak fluently about merits and flaws | 3 to 5 | cards, not paragraphs | one card per point, plus a say-it line |
| Review Guide | 2 hours, has not read the paper | exactly 4 | 60 to 140 words | the visual is the content |
