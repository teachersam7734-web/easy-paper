---
name: prompt-vault-03-after-reading
description: Prompt Vault part 3, after reading (blind recall, sparring with role cards, Feynman teach-back, confidence calibration, SLA theory connections, critical commentary notes, flashcards, concept maps, spaced review); read when a reading unit is finished and you need it to stick.
---

# 03 After reading

How to use this file
- Do these with the PDF closed. The point is retrieval from your own memory; the AI checks against the PDF afterwards.
- Minimum set for a unit: prompt 1 (blind recall) and prompt 2 (sparring). Never cut blind recall. If time is short, shorten sparring to three rounds.
- Evidence note (honest tiers): practice testing and spaced review are the best-supported techniques (high utility in the Dunlosky et al. 2013 review; strong meta-analyses for testing and spacing). Self-explanation, elaboration and teach-back: moderate. Interleaving (mixing topics) helps in some domains, small and variable effect. Concept mapping: moderate, depends on how it is done (building your own map beats studying a ready-made one). Flashcards: strong for retrieval and spacing, weak if the cards are poorly made. Almost none of this is tested specifically in ADHD students; what ADHD research explains is why the habits are hard to keep, which is what the prompts are built to ease.
- Scoreboard: record blind recall (out of 8), sparring (out of 5), confidence (1 to 5) in the strip at the bottom of your notebook page.

Order at a glance

| # | Prompt | Time |
|---|---|---|
| 1 | Blind recall check v2 | 10 min |
| 2 | Sparring match v2 | 8 min |
| 3 | Feynman: teach the novice | 6 min |
| 4 | Confidence calibration | 2 min |
| 5 | SLA theory connection v2 | 5 min |
| 6 | Theory duel (compare two theories) | 6 min |
| 7 | Limits and critique notes | 6 min |
| 8 | Misconception hunt | 4 min |
| 9 | Flashcards v2 (Anki-ready, page-anchored) | 6 min |
| 10 | Cloze terminology deck | 4 min |
| 11 | Concept map checker | 6 min |
| 12 | Exam question workshop | 8 min |
| 13 | Unit exit: three takeaways and next step | 2 min |
| 14 | Next-morning review quiz | 10 min |
| 15 | Day 3 and day 7 skeleton check | 5 min |

---

## 1. Blind recall check v2

**Use when:** straight after the last sprint, PDF closed. First speak or type everything you remember, as if teaching a friend.
**Time:** 10 minutes.

```
Stage 4: blind recall. Below is my explanation of the unit from memory. Compare it with the PDF
and report in this format, under 220 words:

- Got right: ideas I explained correctly (brief list)
- Missed: important ideas I left out (brief list, with the page)
- Misunderstood: anything incorrect, with the correction in one sentence and the page
- Invented: anything I said that is NOT in the PDF (label OUTSIDE THE PDF if it is true elsewhere)
- Score: how many of the 8 most important ideas I recalled correctly, out of 8. List the 8 ideas
  so I can see the key.
- Fix list: the 3 corrections I should write in RED on my map

Be honest and specific. No praise. Then wait.

MY RECALL:
[PASTE OR TYPE YOUR EXPLANATION]
```

**Why it works:** free recall is the strongest form of the testing effect, and the report format turns the result into a map correction. The Invented line catches false memories and AI-style plausible additions.
**Variations:** ask for "only the 3 most important misses" on a low-energy day; record the recall aloud and paste a transcript; ask the AI to rank the 8 ideas by how likely they are to appear in an exam question.

---

## 2. Sparring match v2

**Use when:** after blind recall, to test the weakest points.
**Time:** 8 minutes.

```
Stage 5: sparring match. Act in your assigned role. Challenge me on the weakest points from my
blind recall: Missed and Misunderstood items first.

Before we start, ask me my confidence from 1 (lost) to 5 (solid) and record it.

Rules:
- Ask exactly ONE question at a time. Up to 5 rounds. I answer in 2 to 3 sentences.
- Use these question types, one per round, in this order of difficulty: EXPLAIN a concept; APPLY it
  to a concrete learner or classroom; CONTRAST it with a competing view; PREDICT what would happen
  in a new situation; DEFEND or CHALLENGE a claim from the text using its evidence.
- If my answer is vague, push back with a sharper follow-up. Do not give me the answer.
- If I fail the same question twice, give a short hint. After a third failure, give the answer in
  two sentences and move on.
- After each answer reply with one line: SURVIVED (full), PARTIAL (half), or FALLEN, plus one
  sentence of feedback. Score 1, 0.5 or 0.
- After round 5, give: my score out of 5, and whether my confidence was too high, too low, or about
  right. Then list the one topic to review tomorrow.
Start round 1 now.
```

**Why it works:** effortful, varied questions make retrieval harder and so more durable (desirable difficulties); roles and a score add novelty and stakes, which many people with ADHD find motivating (practice wisdom with moderate support for gamification in ADHD, mostly from child studies).
**Variations:** use "chill" mode (ask for a hint after the first failure) when tired; "exam" mode (one-minute limit per answer) when you are ready; add "make round 3 a trap question where the common answer is wrong."

---

## 3. Feynman: teach the novice

**Use when:** you want to find the gaps behind answers that sound right.
**Time:** 6 minutes.

```
You are a smart first-year student who has never studied linguistics. I will explain the main idea
of [TEXT / CONCEPT] to you in my own words. Rules:
- Say "Okay, I'm listening" and wait.
- After my explanation, ask me up to 3 naive questions, ONE at a time, about the parts that were
  vague or used jargon without explaining it ("What does that word mean?", "Can you give an
  example?").
- When I answer, tell me in one line whether a beginner would now understand, and which word
  still needs explaining.
- At the end, list my gaps in two bins: "I explained clearly" and "I hid behind jargon". Then give
  me one thing to look up in the PDF (with the page).
Do not correct my facts until the end; say "I will check this against the PDF" first.
```

**Why it works:** explaining to a novice exposes the illusion of knowing and uses self-explanation, a moderate-utility technique; the bins make weak spots visible.
**Variations:** change the audience (a teacher with no SLA training, a parent, a journalist, a 12-year-old); run it aloud with a voice mode and write the gaps afterwards; limit to two minutes for a quick test.

---

## 4. Confidence calibration

**Use when:** before sparring, or at the end of a day with several units.
**Time:** 2 minutes.

```
Calibration check. For each of these topics from today's units, I give my confidence (1 to 5) in
brackets: [TOPIC 1 (X), TOPIC 2 (X), TOPIC 3 (X)].
Ask me one quick question per topic (ONE at a time), grade it solid / shaky / blank, and at the
end show me a table: topic | my confidence | result | calibration (overconfident, underconfident,
accurate). Then name the topic where my confidence was most wrong, and give me one tip for it.
No lecture.
```

**Why it works:** learners often judge their own learning poorly right after reading (a well-replicated finding: fluent reading feels like knowing). Seeing the gap between confidence and result corrects it and decides what to review.
**Variations:** repeat the same calibration table a week later to see whether accuracy improves; use as the opening of the day-end quiz.

---

## 5. SLA theory connection v2

**Use when:** after sparring, to anchor the unit in the field's theories (Stage 6 in the original).
**Time:** 5 minutes.

```
Link this unit to ONE SLA theory or construct. Choose from: input hypothesis, interaction
hypothesis, noticing hypothesis, output hypothesis, sociocultural theory, usage-based approaches,
complexity/dynamic systems theory, processability theory, skill acquisition theory, critical
period or age effects, language transfer, task-based language teaching, or tell me if another fits
better. Label this whole part OUTSIDE THE PDF except for the facts you take from it with a page.

Give, in 4 sentences: the theory in one line; how the unit SUPPORTS, CHALLENGES, or EXTENDS it
(pick one and say why); one contrast; one example of evidence in the PDF with the page.
Then ask me to restate the link in ONE sentence of my own, and say if it is accurate, oversimplified
or wrong. After that, give me a second candidate theory and a one-line reason, and let me choose
whether to explore it.
```

**Why it works:** elaborative connection to prior knowledge supports understanding and later retrieval; labelling support, challenge or extension turns a vague link into an argument usable in essays.
**Variations:** ask the AI to choose the weakest link and let me defend it; ask for "the theory that most disagrees with this unit"; ask for a link to my own research topic: [TOPIC].

---

## 6. Theory duel

**Use when:** you need to compare two theories or two papers for an exam or an essay.
**Time:** 6 minutes.

```
Run a theory duel on [THEORY A] versus [THEORY B], applied to this unit. Use ONE question at a time.
Round 1: ask me what each theory would say about the central finding of the unit.
Round 2: ask what evidence in the unit would count as support for A and for B.
Round 3: ask me to name one thing that a researcher from A could not explain without adding an
assumption.
Round 4: ask me to propose a small study that would favour one theory over the other.
After each round, give a one-line verdict (SURVIVED, PARTIAL, FALLEN) and the correction. Label
your outside knowledge as OUTSIDE THE PDF.
At the end, give me a 3-row comparison table (what each assumes, what each predicts for this
unit, one weakness each) to copy.
```

**Why it works:** contrasting two views is a form of interleaved elaboration, which supports discrimination between similar concepts and is exactly what comparative exam essays ask for.
**Variations:** make it a three-way duel; ask for "an essay thesis sentence that takes a position" after the table; use for two papers by changing A and B to authors.

---

## 7. Limits and critique notes

**Use when:** building the Limits & Critique branch, or preparing a critical commentary.
**Time:** 6 minutes.

```
Help me build the Limits & Critique branch. First, ask me to write two lists:
(a) what the authors admit as limitations,
(b) what I noticed (type of evidence, sample size, design, claims versus data).
After I paste them, compare with the PDF and give me:
1. Limitations I missed that the authors state (with pages)
2. Limitations the authors did NOT state but a careful reviewer would raise, labelled as MY
   SUGGESTION, in this order: design, sample, measures, analysis, generalisation, theory
3. The single strongest critique (one sentence)
4. A fair strength of the text (one sentence), so my critique is balanced
5. Two sentence starters I could use in a commentary ("The evidence presented does not...")
Be specific, not generic ("small sample" is not enough: say what it limits).
```

**Why it works:** producing your own critique first (generation) and comparing second keeps you active; stating strengths as well as weaknesses is a feature of good critical writing, and the list order mirrors a reviewer's checklist.
**Variations:** ask for "the reviewer's three questions to the authors"; ask for the limitations ranked by how much they affect the main claim; ask for a 100-word critical paragraph skeleton that I then write myself.

---

## 8. Misconception hunt

**Use when:** after the unit, to prevent carrying away a wrong idea.
**Time:** 4 minutes.

```
List the 4 most likely misreadings of this unit that a reader at MA level might leave with (for
example confusing correlation with cause, mixing up two similar terms, assuming a result
generalises to all learners, or thinking the author says more than they do). For each give:
- the misreading in one sentence
- what the PDF actually says (page)
- a quick test question that would reveal the misreading
Then give me the 4 test questions one at a time and mark my answers solid, shaky, or blank.
```

**Why it works:** naming common misconceptions and testing them directly corrects them better than re-reading (refutation-style learning, moderate evidence), and it targets your own typical slips.
**Variations:** add "include the misreading I made in blind recall" for personal relevance; ask for misreadings that come from the abstract alone.

---

## 9. Flashcards v2 (Anki-ready, page-anchored)

**Use when:** for the weakest topics, after the blind recall and sparring. Make cards from what you got wrong, not from everything.
**Time:** 6 minutes.

```
Make [8] flashcards on these weak topics: [TOPIC 1], [TOPIC 2].
Rules:
- One idea per card (atomic). Questions that need recall, not recognition. No yes/no questions.
- Mix types: 3 definition or concept cards, 2 "who found what" evidence cards, 2 application cards
  (a concrete learner or classroom), 1 contrast card.
- Each answer is under 25 words and ends with the PDF page in brackets, for example [p. 12].
- Use only the PDF. If a card needs outside knowledge, put OUTSIDE THE PDF at the end of the answer.
- Output as plain text, one card per line, in this exact format, with a TAB between fields:
  Question<TAB>Answer<TAB>tags
  Tags: unit name, topic, and the card type. No other text.
After the cards, list any important idea from my weak topics that has NO card yet. Then ask me
which 5 cards I want to keep and which I would rewrite in my own words.
```

**Why it works:** spaced flashcards combine the two best-supported techniques (testing and spacing). Atomic, recall-based cards avoid the known failure of vague, overloaded cards. Making the student the filter means the cards are in their own language, and the page anchor allows quick verification of AI errors, which are common in generated cards.
**Variations:** import the TSV into Anki; ask for cards in both English and Persian; ask for image-occlusion suggestions for a model diagram (describe the regions to hide); ask for "reversed" cards for key terms only.

---

## 10. Cloze terminology deck

**Use when:** the unit has a set of definitions or a model with named stages.
**Time:** 4 minutes.

```
Turn the key definitions and the named parts of the main model in this unit into cloze deletions.
Give [10] items. Rules:
- One blank per item. Blank the key term or the key relation, not a random word.
- Keep each sentence under 30 words, in the PDF's own meaning, with the page.
- Format: one per line, with the blank as {{c1::...}}, then a TAB and the page and unit tag.
- After the list, tell me which three items are most likely to be confused with each other, and
  write one extra card that forces me to tell them apart.
Use the PDF only; label outside knowledge as OUTSIDE THE PDF.
```

**Why it works:** cloze items are quick to answer, so they suit short attention spans, and the confusable-terms card practises discrimination, which most SLA vocabulary needs.
**Variations:** ask for a "stages in order" item; ask for cloze deletions on the hunt-question answers only.

---

## 11. Concept map checker

**Use when:** you drew your map by hand, and you want the AI to audit it, not draw it.
**Time:** 6 minutes.

```
Here is my concept map, typed from my notebook. Format: concept -> relationship -> concept.
[PASTE YOUR LINKS, for example: "output hypothesis -> requires -> pushed production"]
Audit it against the PDF, in under 200 words:
1. Links that are wrong or oversimplified (correction + page)
2. One important link I missed
3. Any concept with no links (an island)
4. Whether my relationship words are specific (replace "relates to" with something precise:
   causes, requires, enables, contrasts with, is a type of)
Then ask me ONE question that makes me add or fix one link. Do not draw a new map for me.
```

**Why it works:** building and auditing your own map is a generative activity; ready-made maps lose most of their benefit. Typed, labelled relationships (a pattern used in several reading tools) make maps usable for essays.
**Variations:** ask the AI to turn my links into a Mermaid diagram to paste into notes; ask which of my links would make the best essay paragraph; add "also check the Limits & Critique branch."

---

## 12. Exam question workshop

**Use when:** a week before an exam, or when you want the unit in exam form.
**Time:** 8 minutes.

```
Write 3 exam questions for this unit for an MA SLA exam, at increasing levels: a short-answer
question, a compare-and-contrast question, and an essay question that asks for a position and
evidence. Do NOT write model answers yet.
Then ask me to write a 5-point outline for the essay question. When I paste it, mark it against
the PDF and your knowledge of the field (label outside knowledge as OUTSIDE THE PDF) with:
- structure (thesis, argument, evidence, counterpoint, conclusion): present or missing
- evidence: which points have a page-anchored source from the PDF
- the strongest point and the biggest gap
Give a model outline only after I ask for it.
```

**Why it works:** practising the exact retrieval you will face is transfer-appropriate, and writing an outline (not an essay) keeps the task small enough to finish.
**Variations:** ask for a timed version (15 minutes); ask for questions from the examiner's point of view with typical mark scheme points.

---

## 13. Unit exit: three takeaways and next step

**Use when:** at the very end of a unit, before the break.
**Time:** 2 minutes.

```
Unit exit. I give you my three takeaways and my next step. Check them in under 100 words:
Takeaways: 1) [..] 2) [..] 3) [..]
Next step: [..]
Say for each takeaway: accurate / partly accurate (fix it) / not supported by the PDF. Check that
the next step is a concrete action I can start in under 5 minutes ("Unit 2: preview headings"),
not a vague one. Finally, tell me the scoreboard totals I gave: sprints [X/Y], recall [X/8],
sparring [X/5], confidence [X]. Then say: "Break. No screens."
```

**Why it works:** ending with a concrete next step makes the next start easy; a quick accuracy check prevents false takeaways from entering your notes.
**Variations:** ask for a one-line "what to remember in a year" from the unit; add a "what I will tell a friend tonight" line for social encoding.

---

## 14. Next-morning review quiz

**Use when:** the next morning, before any new material.
**Time:** 10 minutes.

```
Review session. My two weakest topics from yesterday were: [TOPIC 1] and [TOPIC 2]. Quiz me on each
with 3 questions, ONE at a time, mixing definition, evidence and application. Mark each answer
solid / shaky / blank and correct it in one sentence with the page if the unit is uploaded. If it is
not, say so and rely on my notes: [PASTE NOTES OR CARDS].
End with a one-line verdict for each topic (solid, shaky, weak) and tell me whether to review it
again in 2 days or in 7 days.
```

**Why it works:** a second retrieval after sleep, at a longer gap, is where spacing pays off (strong evidence for distributed practice); a verdict tells you when to schedule the next review.
**Variations:** add a "yesterday's confidence versus today's result" line; add a topic from the unit before yesterday for interleaving.

---

## 15. Day 3 and day 7 skeleton check

**Use when:** on day 3 and day 7 after a unit, after you redrew the skeleton from memory, no AI during drawing.
**Time:** 5 minutes.

```
Skeleton check for the unit "[UNIT / MISSION NAME]". I redrew the map from memory on day [3 / 7].
Here is what I remembered: [PASTE BRANCHES AND KEYWORDS].
Compare it with my original keywords and the PDF if uploaded. Report:
- Stable: branches I kept intact
- Faded: keywords or links that decayed (rank the 3 most important)
- Distorted: anything that changed meaning
Then ask me 2 questions on the faded items, ONE at a time. End with: "Next review: day [X]."
```

**Why it works:** expanding review gaps (day 1, 3, 7) match the spacing literature's advice that the best gap grows with the retention interval, and a skeleton redraw is a cheap, no-screen retrieval task.
**Variations:** at day 14 or 30 ask for a two-minute spoken summary instead of a drawing; add the "weekly SLA theory map" prompt from the original system as a closing step.

---

## Role cards (paste into the opener; rotate across units)

| Role | Paste this | Best for |
|---|---|---|
| Strict examiner | You are a strict but fair MA examiner. Formal, precise, unimpressed by vague answers. | empirical reviews, exam practice |
| Curious beginner | You are a smart first-year student who has never heard of this topic. Ask me naive questions and make me explain things simply. | Feynman, vocabulary-heavy theory |
| Rival researcher | You are a researcher from a competing theoretical camp. You respectfully dispute my reading, question the method, and look for weaknesses. | claim-heavy conceptual texts |
| Journalist | You are a science journalist on deadline. You want the headline, the so-what and the implications for learners and teachers, in plain words. | significance, impact statements |
| Peer reviewer (new) | You are Reviewer 2 for a journal. You check whether the conclusions follow from the evidence, and you ask for the missing control, measure or analysis. | critical commentary, methods |
| Supervisor (new) | You are my thesis supervisor. You ask what the text means for MY research question [QUESTION], and you push me to be specific. | literature review, thesis work |
| Classroom teacher (new) | You are an experienced language teacher with no research training. Ask me what I would change in my classroom Monday morning. | application, practical implications |
| Study buddy (new) | You are a friendly classmate studying with me. Encourage me briefly, never gush, and quiz me casually. | low-energy days, chill mode |
