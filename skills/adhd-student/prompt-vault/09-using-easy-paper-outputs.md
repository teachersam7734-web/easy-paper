---
name: 09-using-easy-paper-outputs
description: Prompt Vault 09, 9 prompts for studying an Easy Paper Deep Dive, Critique, Review Guide or Vocab Treasure PDF with an AI buddy and for combining them; read right after generating or opening an Easy Paper PDF.
---

# 09. Using Easy Paper Outputs

Easy Paper turns an Applied Linguistics/SLA paper into an ADHD-friendly study PDF. This file shows how to study the PDF actively with an AI buddy instead of just reading it. Paste the relevant PDF text into the chat (or attach it if your AI supports files), then use these prompts. If your PDFs differ from the descriptions below, adjust the section names.

Four modes (names as used by the plugin):

| Mode | Best use | Suggested prompt | Time |
|---|---|---|---|
| Deep Dive | first full understanding of one paper | 9.1, 9.2 | 40 to 60 min |
| Critique | evaluation, commentary writing | 9.3 | 30 min |
| Review Guide | exam review across several papers | 9.4, 9.5 | 20 to 30 min |
| Vocab Treasure | terms, collocations, academic language | 9.6 | 15 min |

Combining them: Deep Dive (understand) then Vocab Treasure (terms) then Critique (evaluate) then Review Guide (revise and exam) is a sensible order. Prompt 9.7 builds that sequence; 9.8 merges several papers; 9.9 builds a spaced schedule from all four.

Rules for every prompt: use only the pasted PDF text; ask one question at a time when quizzing; flag anything not in the text; check at least one citation or page number against the original paper yourself. Retrieval practice and spacing are the strongest levers here (Roediger & Karpicke 2006; Cepeda et al. 2006; Dunlosky et al. 2013, full references in `references/sources/github-tutor-focus.md`).

---

### 9.1 Deep Dive: preview and goal setting (before reading)

**Use when:** you open a Deep Dive PDF and have not read it yet.
**Time:** 5 minutes.

```
I have an Easy Paper "Deep Dive" PDF for [PAPER TITLE]. Do NOT summarise it. Ask me, one at a time: (1) Looking only at the headings, what do I think the paper is about? (2) What do I already know about [TOPIC]? (3) What do I want to answer by the end (up to 3 questions)? Then tell me which 2 sections of the PDF to read first for those questions, and a time budget in 12-minute sprints. Paste of headings and key boxes: [PASTE HEADINGS OR TABLE OF CONTENTS]
```

**Why it works:** Prediction and goal setting before reading (a preview) focus attention and make later retrieval easier. It matches the "every sprint has a mission" principle.
**Variations:** "Make three prediction questions I answer from the headings".

---

### 9.2 Deep Dive: active reading and recall loop

**Use when:** you are reading a Deep Dive section by section.
**Time:** 10 to 15 minutes per section.

```
Run a read-recall loop with the Deep Dive PDF. I'll tell you which section I'm about to read. Step 1: I read it for [12] minutes. Step 2: I write (blind) a 5-line recall, then paste it. Step 3: you compare it with the section text I paste: list what I got right, what is missing, and what is wrong (cite the line or page in the PDF). Step 4: ask me two questions on what I missed. Step 5: record red corrections. Then ask which section is next. Keep each reply under 100 words. Text of the section: [PASTE]
```

**Why it works:** Read, recall, check is retrieval with feedback. The red corrections list maps to the original system's notebook colour code.
**Variations:** "Skip step 4 when I'm low on energy".

---

### 9.3 Critique PDF: argue back

**Use when:** you have a Critique PDF (strengths, weaknesses, questions about the paper) and need to form your own view.
**Time:** 30 minutes.

```
I have a Critique PDF for [PAPER]. Here is its text: [PASTE]. Treat it as someone's opinion, not truth. Do these in order, one at a time:
1. Ask me to rate each critique point as agree / partly / disagree, and why, from my own reading.
2. For each I rate "agree", ask me for the exact evidence in the paper (section or page).
3. Challenge two of my "disagree" points as a devil's advocate.
4. Ask me: What is the paper's strongest contribution, in one sentence?
5. Build with me a table: CLAIM | EVIDENCE IN PAPER | MY JUDGMENT | WHAT I WOULD NEED TO CHECK.
Do not write my commentary. Mark anything the Critique says that is not supported by the paper text as "not found in paper".
```

**Why it works:** Evaluating a critique forces you to form a position and find evidence, which is the skill critical commentary assessments test. Treating AI-generated critique as a hypothesis keeps you from adopting it uncritically.
**Variations:** "Compare this critique with a second one I paste".

---

### 9.4 Review Guide PDF: turn it into a quiz set

**Use when:** you have a Review Guide before an exam or seminar.
**Time:** 20 minutes.

```
Turn this Review Guide into practice. Paste: [PASTE]. Create (a) 8 retrieval questions across levels (recall, explain, compare, apply), (b) 3 "why does this matter for teaching?" questions, and (c) 1 essay-style question. Then quiz me, one at a time. Let me try twice before revealing. After the quiz list MISSED items and map each to the page or section of the Review Guide so I can re-read only those. Do not use outside knowledge; if the guide lacks something, say "guide does not cover this".
```

**Why it works:** Converting passive review material into questions is the most efficient use of a study guide (practice testing: strong evidence). Mapping misses to sections reduces unnecessary re-reading.
**Variations:** "MCQ only", "oral only".

---

### 9.5 Review Guide: teach it back and gap list

**Use when:** after 9.4, to move from recognising to explaining.
**Time:** 15 minutes.

```
Play a novice student. I'll teach you the main ideas of the Review Guide, using no notes. Ask one question at a time. After 6 exchanges, say LESSON COMPLETE and list: ideas I explained well, ideas I skipped (compare with the guide text I paste), terms I used without defining, and one question I should expect from an examiner. Guide text: [PASTE]
```

**Why it works:** Explaining to a novice is a generative activity that shows what you cannot yet say (teaching effect: moderate evidence, citation unverified here). Adapted from the Mollicks' "Teach the AI as student" prompt (CC BY 4.0).
**Variations:** "Make the novice a skeptical examiner".

---

### 9.6 Vocab Treasure: learn the words, use them

**Use when:** you have a Vocab Treasure list (terms, collocations, academic phrases) from a paper.
**Time:** 15 minutes.

```
I have a Vocab Treasure list from [PAPER]: [PASTE LIST]. Teach me actively, not by listing. Steps: (1) pick 5 terms I mark as "unknown"; (2) for each, ask me to guess the meaning from the sentence context I paste; (3) give a short definition (15 words) and one collocation; (4) ask me to write ONE original sentence about my own research topic using it; (5) correct my sentence kindly, showing the problem in 6 words; (6) after all five, quiz me on them in a different order, then again after 10 minutes if I ask. Mark any term you cannot verify from the list as "check in dictionary".
```

**Why it works:** Retrieval, context and productive use help vocabulary stick more than reading a list. Spaced re-quizzing adds the distributed practice effect.
**Variations:** "Persian/Farsi gloss in brackets after English" (only if you check it), "pronunciation notes".

---

### 9.7 Combine the four modes into one study session

**Use when:** you have several PDFs for the same paper and need a plan.
**Time:** 10 minutes setup.

```
I have these Easy Paper outputs for [PAPER]: [LIST which: Deep Dive / Critique / Review Guide / Vocab Treasure]. My goal: [UNDERSTAND / WRITE COMMENTARY / PASS EXAM on DATE]. I have [HOURS] and [ENERGY] today. Make a sequence of 12-minute sprints, each with: which PDF section, the activity (read, blind recall, quiz, teach back, argue), the output I will have. Rules: always start with the Deep Dive for understanding; use Vocab Treasure in sprints 3 to 4 when I know the context; do Critique only after understanding; end with a Review Guide quiz. Put a break every 3 sprints. Ask me one question: what is the first sprint I'm willing to start in 2 minutes?
```

**Why it works:** Sequencing from understanding to evaluation to review follows how knowledge builds; sprints and breaks suit short attention spans. Practice wisdom for the exact order.
**Variations:** "Low-energy version: only Vocab Treasure and a 5-question quiz".

---

### 9.8 Cross-paper synthesis from several Deep Dives

**Use when:** you have Deep Dives or Review Guides for 3 or more papers and need to connect them.
**Time:** 25 minutes.

```
I'll paste summaries from [NUMBER] Easy Paper outputs, labelled Paper A, B, C. Use only these texts. Ask me, one at a time: what theme connects them; where do they agree; where do they conflict (and why: definitions, method, population); which one has the strongest evidence and why. Then build a comparison table: Paper | Question | Method | Key claim | Limitation | Link to others. Mark empty cells "not in the summary". End by asking what question my own project could ask that none of them answers. Do not write the literature review.
Texts: [PASTE]
```

**Why it works:** Comparing across sources is the step from summary to synthesis; structured tables reduce working-memory load.
**Variations:** "Order the papers as a timeline of ideas".

---

### 9.9 Spaced review plan from Easy Paper PDFs

**Use when:** after finishing a paper, to keep the knowledge.
**Time:** 5 minutes.

```
Create a spaced review plan for my Easy Paper material on [PAPER]. Today is [DATE]; my deadline or exam is [DATE]. Build a table of review dates with growing gaps (for example day 1, 3, 7, 14, 28 or as fits my deadline). For each date: which PDF section to use, the activity (blind recall, 5 questions, teach back, one critique point), and a 10-minute cap. Add a final pre-exam review. Include a note: "If you miss a review, do the next one; do not restart". Output as a checklist I can paste into my planner.
```

**Why it works:** Spacing (strong evidence) and short capped sessions lower the barrier; the "do not restart" rule reduces all-or-nothing quitting.
**Variations:** "Max 3 reviews per day across all papers" when you have several PDFs.
