---
name: prompt-vault-04-textbook-chapters
description: Prompt Vault part 4, adapting the before, during and after routine to a textbook chapter (chapter orientation, four-sprint plan, heading-to-question, study-box decoding, chapter-end questions, section ladder, primary-source check, Cornell cues, multi-day handoff); read when the unit is a book chapter, not an article.
---

# 04 Textbook chapters

How a chapter differs from an article
- Longer but more predictable: headings, boxes, learning objectives, summaries and end questions give free structure. Use them before reading, not after.
- The textbook is a secondary source. It simplifies and chooses; important claims should be traced to the primary study at least once per chapter (prompt 7).
- A chapter takes four sprints (about 94 minutes in the original system) and often more than one sitting. Prompt 9 carries the state between days.
- Same rules as the rest of the vault: one question at a time, printed page numbers, OUTSIDE THE PDF label, and the AI never reads for you. Prompts from files 01 to 03 still work; this file only adds or adapts.
- Evidence note: the SQ3R-style steps (survey, question, read, recite, review) are a long-standing practice method; they share the underlying mechanisms of previewing, questioning and retrieval, which are better supported than the SQ3R package as a whole. Cornell-style cue questions are practice wisdom built on retrieval practice. Treat the sequence as a sensible workflow, not a proven programme for ADHD.

Order at a glance

| # | Prompt | Time |
|---|---|---|
| 1 | Chapter orientation (survey) | 8 min |
| 2 | Four-sprint chapter plan | 4 min |
| 3 | Heading-to-question converter | 4 min |
| 4 | Study-box and boxed-study decoder | 4 min |
| 5 | Chapter-end questions as pretest and posttest | 6 min |
| 6 | Section ladder (one-line synthesis) | 6 min |
| 7 | Textbook versus primary source check | 6 min |
| 8 | Cornell cue columns | 6 min |
| 9 | Multi-day handoff note | 2 min |
| 10 | Chapter to exam bridge | 8 min |

---

## 1. Chapter orientation (survey)

**Use when:** before reading a chapter. Replaces the 8-minute article preview.
**Time:** 8 minutes.

```
Coach me through a survey of this chapter, [CHAPTER TITLE], in 6 steps. You tell me WHERE to look,
I look, and I answer in one sentence. Do NOT summarize the chapter.
1. Learning objectives or opening questions (if any), with page
2. Headings and sub-headings only: list them from the PDF so I can see the skeleton
3. Boxes, tables and figures: list them by title and page, no content
4. The chapter summary and key terms list
5. The end-of-chapter questions (read them, do not answer)
6. Where this chapter sits in the book (previous and next chapters, if the PDF shows them)
After step 6, ask me: "What do you predict is the main argument of this chapter?" and, separately,
"Which two headings look hardest?" Then give me a 5-line "chapter skeleton" with section names
and page ranges. Keep each message under 120 words.
```

**Why it works:** a survey builds a structure that holds details later, and the pre-question tells you what to read for. Doing the looking yourself keeps you active, and a visible skeleton reduces the "wall of text" feeling.
**Variations:** for a very long chapter, ask for the survey of half the chapter only; ask for a "what is new compared with the previous chapter" line when reading in order.

---

## 2. Four-sprint chapter plan

**Use when:** after the survey, to decide what to read and in what order.
**Time:** 4 minutes.

```
Plan the reading of this chapter in FOUR sprints of about 12 minutes (more if the chapter is
over [30] pages; then tell me how many). Using the survey: [PASTE YOUR SKELETON OR SAY "from the PDF"].
For each sprint give: page range, section names, the question it serves, what to SKIM (examples,
repeated explanations, long case descriptions) and what to SKIP (reference lists, optional boxes)
and why. Put the densest section where I said my energy is highest: [WHEN]. Add at the end a
10-minute blind recall slot and an 8-minute sparring slot. If I have only [MINUTES] today, show
which sprints to do today and which tomorrow, and write the tomorrow stop-point as a sentence
I can paste into my notebook. Table format; then ask: "Does this fit?"
```

**Why it works:** splitting a long chapter into pre-defined chunks with a stop-point makes it finishable and lowers the temptation to read straight through; placing the hard part in a high-energy window respects energy fluctuation.
**Variations:** ask for a 7-sprint version over two days; ask for a "minimum viable chapter" of two sprints (core sections only) for bad days.

---

## 3. Heading-to-question converter

**Use when:** before each sprint. This is the SQ3R "Question" step, with you doing the writing.
**Time:** 4 minutes.

```
Take the headings and sub-headings of pages [PAGES]: [PASTE HEADINGS, or "from the PDF"].
For each heading, ask me to write ONE question I expect the section to answer (for example
"Interaction" becomes "What role does interaction play and for which learners?"). Do it ONE heading
at a time. After each of my questions: say if it is too vague, too narrow, or good, and offer one
sharper version in a single line.
At the end, rank my questions: which 3 are most likely to appear in an exam, and which one the
chapter probably does NOT answer. Do not answer any question.
```

**Why it works:** turning headings into questions creates a purpose for each section and uses generation, which is more effective than being handed questions; checking the questions teaches you how to ask better ones.
**Variations:** ask for the AI to write the questions only if I am stuck; ask for a mix of definition, evidence and application questions; ask for question stems typical of my course exams.

---

## 4. Study-box and boxed-study decoder

**Use when:** the chapter includes boxes summarising a study, a "key study", a research methods box, or a classroom activity.
**Time:** 4 minutes.

```
Help me read this box on page [PAGE], titled "[BOX TITLE]". Ask me ONE at a time:
1. What is the question the study asked? Wait.
2. Who took part and what did they do? Wait.
3. What did they find, in one sentence? Wait.
Then compare with the box and tell me in under 100 words:
- What the box leaves out (for example the design, the sample size, how learning was measured)
- How the main text uses this study (which claim does it support?) with the page
- One question I should ask before trusting the claim
If a detail is not in the PDF, write "not in the box". Label anything else as OUTSIDE THE PDF.
```

**Why it works:** textbook boxes compress studies to a headline and invite uncritical acceptance; reconstructing the study yourself, then seeing what was cut, builds evaluation skill and flags which studies are worth tracing.
**Variations:** ask to put all boxes in the chapter in one comparison table (study, claim, sample, type of evidence); skip to prompt 7 for the three most important studies.

---

## 5. Chapter-end questions as pretest and posttest

**Use when:** twice, once before the first sprint (to see what you know) and once after the last sprint (to see what changed).
**Time:** 6 minutes.

```
Use the end-of-chapter questions in the PDF (pages [PAGES]). PRETEST: pick the 4 questions that
cover different sections and ask me ONE at a time. Grade each solid / shaky / blank with no
explanation. Record the result as a table: question | section | pretest result.
[LATER, AFTER THE SPRINTS:] POSTTEST: ask the same 4 questions again in a different order, and
add 2 new questions of your own on sections where I was blank in the pretest. Grade each, then show
the pretest-to-posttest change and name the weakest section. Use only the chapter; mark outside
knowledge as OUTSIDE THE PDF. Do not show model answers until I have answered.
```

**Why it works:** attempting questions before studying primes attention to the answers (the pretesting effect, moderate evidence), and the pre/post comparison gives the immediate, visible progress that suits people who respond poorly to delayed reward.
**Variations:** ask for the posttest next morning instead of straight away (stronger spacing); if the chapter has no questions, ask the AI to write four from the objectives, labelled "AI-written, not the author's".

---

## 6. Section ladder (one-line synthesis)

**Use when:** after each sprint, instead of a full cluster check, when the sections are many and short.
**Time:** 4 to 6 minutes.

```
I read pages [PAGES], covering these sections: [SECTION LIST]. From memory, I write ONE line for
each section, in my own words:
[PASTE YOUR LINES]
Check each line against the PDF. For each give: ok, or fix (with the page). Then ask me ONE
question: "How does section [X] connect to section [Y]?" Mark my answer solid / shaky / blank.
At the end, give me my lines joined in order as a chapter chain: Section 1 -> Section 2 -> ...
with one linking word between each (so, but, because, therefore). Do not add content I did not
write; mark your own corrections in brackets so I can colour them red.
```

**Why it works:** one line per section forces compression and recall, and the linking words show the chapter's argument structure, which is the thing students most often lose in long chapters.
**Variations:** ask for the chain as a flow diagram in text; at chapter end ask me to compress the chain into three lines.

---

## 7. Textbook versus primary source check

**Use when:** a chapter makes a strong claim you may need to cite or to argue with, especially for an assignment.
**Time:** 6 minutes.

```
In this chapter, page [PAGE], the author claims: "[CLAIM]" and cites [AUTHOR (YEAR)]. Help me
check how safe it is to rely on this. Do NOT invent the original study. Ask me, ONE at a time:
1. What kind of claim is it (finding, theory, opinion)? Wait.
2. What does the textbook give about the original (design, sample, measure)? Wait.
Then tell me in under 120 words:
- What the chapter gives, and what it leaves out
- What I should look for in the original (title, abstract, method, sample, limitations)
- Three search terms to find it in a library or Google Scholar, based only on the citation
  details in the PDF
- A fair way to cite it in my writing: "as discussed in [textbook author]" until I have read the
  original
If you are not sure the original study exists as described, say so.
```

**Why it works:** this blocks a common error (citing a textbook's summary as if it were the study) and trains source-tracking, which is a basic requirement in graduate work; stating uncertainty reduces the risk of AI-invented references.
**Variations:** ask for the same check on a list of three claims; ask what "secondary citation" format my style guide expects. Verify any real reference using a reference checker or your library, not the AI.

---

## 8. Cornell cue columns

**Use when:** your notes are in two columns (Cornell-style) and you want cue questions in the margin and a summary at the bottom.
**Time:** 6 minutes.

```
I take Cornell-style notes. Here are my notes for pages [PAGES], typed from my notebook:
[PASTE NOTES]
1. Ask me to write, for each note block, a CUE QUESTION for the left margin. Do it ONE block at a
   time. Say if a cue is too easy (a yes/no) or good, and offer a sharper version.
2. When all cues are done, quiz me from the cues alone, with my notes hidden: ask 4 cues at random,
   ONE at a time, and grade my answers against my notes and the PDF.
3. Ask me to write a 3-sentence summary for the bottom of the page, then check it for accuracy and
   for anything important missing, with pages.
Do not write my notes or my summary for me.
```

**Why it works:** cue questions turn notes into a self-test, which converts note-taking from passive copying into retrieval practice; the summary at the bottom is a compact review.
**Variations:** ask for cues in the style of past exam questions; ask the AI to rate each cue as recall, explain or apply level; export the cue-answer pairs to flashcards using prompt 9 in file 03.

---

## 9. Multi-day handoff note

**Use when:** at the end of a sitting when the chapter is not finished, so you can restart quickly tomorrow, even in a new chat.
**Time:** 2 minutes.

```
Stop for today. Write me a HANDOFF NOTE I can paste at the start of a new chat. Keep it under 150
words, plain text, in this layout:

=== CHAPTER HANDOFF ===
Chapter: [TITLE, pages]
Mission name: [..]
Done: sprints [..] covering pages [..]
Next: sprint [..], pages [..], hunt question [..]
My cluster so far (from what I told you): [keywords with pages]
Shaky or blank items: [..]
Open Confusions: [..]
Scoreboard: recall [..], sparring [..], confidence [..]
Restart sentence: "The next sentence I read starts with: [..]"
=== END ===

Use only what I told you in this chat. If something is missing, write "not recorded". Then tell
me: "Save this note. Paste it into a new chat with the PDF tomorrow."
```

**Why it works:** chats forget, and re-explaining where you were is a barrier to restarting. A short, structured state note (a pattern also found in ADHD study-coach tools) lowers the cost of starting and avoids relying on memory.
**Variations:** paste the note into the opener of the next day's chat along with prompt 1 from file 01; add "and generate 3 warm-up questions for tomorrow from the shaky items".

---

## 10. Chapter to exam bridge

**Use when:** the chapter is on a syllabus and you want to see it in exam terms.
**Time:** 8 minutes.

```
Turn this chapter into an exam kit, using only the PDF unless you label it OUTSIDE THE PDF:
1. The 6 terms I must be able to define, with the page of each definition
2. The 3 studies or arguments I must be able to cite, with who/when/what, as given in the PDF
3. The 2 debates or contrasts the chapter sets up
4. Three possible essay questions from this chapter, from easier to harder
Then run a 5-question oral exam on the kit, ONE at a time, mixing a definition, a cite-the-study,
a contrast, an application, and an evaluation question. Grade each SURVIVED, PARTIAL, or FALLEN
with a one-sentence fix. End with my score out of 5 and one thing to revise tomorrow.
```

**Why it works:** rehearsing the form of the exam (recalling, citing, contrasting) is transfer-appropriate practice, and a fixed kit makes revision a short, finite task instead of "re-read the whole chapter".
**Variations:** ask for the kit as 10 flashcards (use prompt 9 in file 03); ask for a one-page "cheat sheet" outline I will copy by hand; run the oral exam with a different role card.
