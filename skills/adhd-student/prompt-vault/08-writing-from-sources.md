---
name: 08-writing-from-sources
description: Prompt Vault 08, 9 prompts for turning reading notes into critical commentaries, proposals and literature reviews, paraphrasing honestly and avoiding AI plagiarism; read before writing any assessed text from sources with an AI buddy.
---

# 08. Writing From Sources

Core rule for this file: the AI is your coach, not your ghostwriter. Prompts ask for questions, outlines, checks and feedback. Where a prompt produces example wording, you must rewrite it in your own voice and cite the original source yourself. Always follow your university's AI policy, and declare AI help if required. Ask your supervisor if the policy is unclear.

Why: unguarded AI answers can reduce learning (Bastani et al., SSRN preprint "Generative AI Can Harm Learning", https://doi.org/10.2139/ssrn.4895486; emerging evidence from a high-school maths experiment, not SLA), and a "write first, then ask" habit keeps the thinking with you. Detection tools are unreliable, so the safe route is real authorship plus honest sourcing, not hiding AI use.

Workflow that fits ADHD: (1) notes with page numbers, (2) one-sentence claim, (3) outline, (4) ugly first paragraph, (5) coach feedback, (6) revise, (7) check citations yourself. Use short sprints (10 to 15 minutes) per step.

---

### 8.1 Notes to claim (find your argument)

**Use when:** you have reading notes but no thesis for your commentary.
**Time:** 15 minutes.

```
I will paste my notes on [TEXT(S)] with page numbers. Do NOT write my commentary. Ask me, one at a time: (1) What surprised or bothered me? (2) What does the author claim, in one sentence? (3) What evidence did they give, and what kind (experiment, survey, argument, case study)? (4) What is missing or too strong? (5) What do I want the reader to believe after reading my text?
Then help me write ONE sentence of the form "Although [author] argues X, the evidence of [type] shows Y because Z". Offer three ways to improve it as questions, not as rewritten sentences. Mark any claim not in my notes "not in notes".
Notes: [PASTE]
```

**Why it works:** Critical commentary needs a position; question-led coaching builds your own argument. The claim template pushes toward evaluation, not summary.
**Variations:** "Give me 3 alternative claims to compare, then I'll choose".

---

### 8.2 Critical commentary scaffold (outline only)

**Use when:** you have a claim and need a structure for a commentary of [WORD COUNT] words.
**Time:** 15 minutes.

```
Help me outline a critical commentary of [WORD COUNT] words on [TEXT]. My claim: "[CLAIM]". My notes: [PASTE or "see above"].
Propose an outline with: purpose of the paragraph, the question it answers, which of MY notes (with page) feed it, and a word budget. Typical sections: introduction and aim; brief summary (about 20 percent); evaluation of argument; evaluation of evidence and method; wider context or alternative views; implications and limits; conclusion. Leave the content of each point blank for me to fill. Ask me whether the balance of summary versus evaluation is right. Do not write sentences for the body.
```

**Why it works:** A skeleton lowers the start cost and prevents the common problem of too much summary, while authorship stays with you. Word budgets support pacing.
**Variations:** "Use my programme's CC template: [PASTE HEADINGS]".

---

### 8.3 Write-first feedback loop (coach, don't rewrite)

**Use when:** you have written a rough paragraph.
**Time:** 10 minutes per paragraph.

```
Act as a writing coach. I'll paste one paragraph from my [COMMENTARY / PROPOSAL / REVIEW]. Rules: do not rewrite it; point to words I wrote. Give me: (1) one strength; (2) the main problem (claim unclear, no evidence, too descriptive, weak link to the next paragraph, wrong register); (3) one technique to fix it (for example: put the claim in the first sentence; add evidence with source and page; use a hedge such as "suggests" instead of "proves"); (4) two questions that would make me improve it myself. Then ask "How will you revise it?" and wait. If I paste a revision, give feedback on the changes only.
Paragraph: [PASTE]
```

**Why it works:** A single focus per round avoids overwhelm; the student does the revising. Structure adapted from the Mollicks' mentor-feedback prompt (CC BY 4.0) and a writing-coach persona pattern in prompts.chat's system prompt chapter.
**Variations:** "Check only for hedging and certainty language", or "check only for cohesion".

---

### 8.4 Literature review matrix (synthesis, not a list)

**Use when:** you have 5 to 15 sources and need to compare them.
**Time:** 20 minutes.

```
Help me build a literature review matrix. I'll give you my notes on each source (author, year, aim, method, sample, key finding, limitation, page numbers). Make a table with those columns plus "agrees with" and "disagrees with" and a short "theme" column. Use ONLY my notes; mark gaps as "missing in notes". Then ask me: What are the 2 to 4 themes? Where do sources conflict? What is the gap my project fills? After my answers, propose a paragraph plan per theme (topic sentence idea, which sources, how they relate). Do not write the paragraphs.
My notes: [PASTE]
```

**Why it works:** A review is a synthesis around themes, not a source-by-source summary; the matrix makes comparisons visible and reduces working-memory demands. Pipeline of classify, frame, then draft follows the approach in the academic-prompt libraries reviewed (see sources file).
**Variations:** "Group by method" for methodology chapters, or "by theoretical approach".

---

### 8.5 Proposal builder (gap, aim, RQs, method)

**Use when:** you are writing a research proposal for an MA thesis or course assignment.
**Time:** 30 minutes.

```
Coach me through a research proposal in applied linguistics. Ask one question at a time and wait: (1) topic and why it matters in teaching or learning; (2) the gap, in one sentence, with at least two sources from MY notes; (3) aim and 2 or 3 research questions (you may point out if they are too broad or not answerable with data); (4) design and participants; (5) data collection tools; (6) analysis; (7) ethics; (8) limits; (9) timeline.
After each answer, give one line of feedback and one improvement question. At the end, make a one-page checklist of what is still weak. Do not invent sources. If you suggest a possible reading, label it "to search, not verified".
```

**Why it works:** Stepwise questioning mirrors how supervisors guide students and prevents an overwhelming blank page. The "not verified" rule curbs fake citations.
**Variations:** "Check RQs against Bloom-style verbs (describe, compare, explain)" or "check that each RQ has a matching analysis".

---

### 8.6 Honest paraphrase check

**Use when:** you paraphrased a passage and want to make sure it is neither too close to the source nor distorted.
**Time:** 5 minutes.

```
I'll paste the ORIGINAL passage and MY paraphrase. Compare them. Tell me: (1) Is the meaning the same, stronger, or weaker? (2) How many words or phrases (3+ words in a row) are copied? List them. (3) Is the sentence structure too close to the original? (4) Did I keep the author's hedging level (e.g. "suggests")? (5) Do I still need a citation and, for a quote, quotation marks and a page number? Do not rewrite my text; ask me one question that helps me improve it.
ORIGINAL: [PASTE]
MY PARAPHRASE: [PASTE]
```

**Why it works:** Close paraphrase ("patchwriting") is a common source of accidental plagiarism, especially for second-language writers; a mechanical check plus a question helps without taking over.
**Variations:** "Check only for copied phrases", or "check that my paraphrase includes the author's limitation".

---

### 8.7 Citation and claim audit

**Use when:** before you submit, or each time you add a source.
**Time:** 10 minutes.

```
Audit my draft for sourcing. I'll paste a section and my reference list. For each sentence that makes a factual or theoretical claim, tell me: (a) is there a citation, (b) is it a direct quote, paraphrase or my own claim, (c) is the claim specific enough to check, and (d) is a page number needed. List sentences where I am relying on a source I have not listed. Do NOT add new sources or invent references. At the end ask: "Which of these have you personally checked in the original?"
Draft: [PASTE]   References: [PASTE]
```

**Why it works:** Separating own claims from sourced claims is the heart of academic integrity; the closing question keeps verification on you. For checking that references actually exist, use a reference-checker tool or your library database, not the chatbot.
**Variations:** "Check APA 7th formatting only after I fix the content".

---

### 8.8 Responsible-AI-use log and disclosure

**Use when:** your course asks for AI disclosure, or you want a record of how you used AI.
**Time:** 5 minutes.

```
Help me write an honest AI-use note for my assignment. Ask me, one at a time: which tool I used; for which steps (brainstorming, quizzing, outline feedback, language checking, other); what I wrote myself; what I changed after the AI's feedback; what I verified in the original sources; what AI-generated text, if any, appears in my final version. Then draft a 3 to 5 sentence disclosure in the first person that matches my answers and my university's policy: [PASTE POLICY OR SAY "unknown"]. If the policy says my use is not allowed, tell me and suggest I ask my instructor. Do not exaggerate or minimise my use.
```

**Why it works:** A record encourages honest, limited use and protects you if questions arise. This is practical advice, not a legal guarantee.
**Variations:** "Output a table: Step / AI role / my role / verified how".

---

### 8.9 Language polish without changing meaning (L2 writers)

**Use when:** your argument and structure are settled and you want help with grammar and style only, if your policy allows language checking.
**Time:** 10 minutes.

```
I'm a second-language writer. Edit for grammar, word choice and clarity ONLY; do not change my claims, add ideas, or add citations. For each change show: original / suggestion / reason in 6 words or fewer. Highlight the five most frequent error types in my writing and explain each in one line with one example from my text. Then give me a 3-item checklist for my next draft. Ask me to apply the changes myself.
Text: [PASTE up to 300 words]
```

**Why it works:** Error-pattern feedback teaches a transferable skill rather than fixing one text. Limiting the edit scope protects authorship. Check whether your institution counts this as permitted help.
**Variations:** "Only flag; don't suggest", so you have to produce the fix.
