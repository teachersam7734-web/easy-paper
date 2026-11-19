# Humanizer: CC-specific humanizing and polishing protocol

Load this file in two situations. In WRITE mode, apply all of it to the CC you draft before you show it. In REVISE mode, do not sweep the user's text through these lists; use them only to diagnose, and change the user's text only through the tiers in `scoring-and-revision.md`. A user's plain word is never an error.

The target is a CC that reads as the work of one experienced Applied Linguistics professor who read this one paper closely. Quality comes from content first (specific, verified, fair judgments), then structure, then sentences, then words. Fixing words alone does not fix a generic CC: structure survives rewording (StoryScope, COLM 2026, via imf2-tells-1: removing surface artefacts cut detection by only 1.6 points). Work in that order.

Evidence tiers used below: [A] measured in a study whose passages were read; [B] abstract or metadata only; [C] practitioner claim; [D] own measurement on about 28,000 words of human-written reviews (research_R4); [E] design heuristic.

---

## 1. Hard rules (no exceptions in WRITE mode)

| # | Rule | What to do instead |
|---|---|---|
| H1 | Zero em dashes (U+2014) and zero en dashes (U+2013). No spaced hyphen used as a dash (" - "), no double hyphen ("--"). | Comma, colon, parentheses, a full stop, or "and". Page ranges in references take a plain hyphen: `65(S1), 37-75`. Number ranges in prose take "to": "15 to 30 words". |
| H2 | Zero exclamation marks. | State the point calmly. Emphasis comes from evidence. |
| H3 | No rhetorical questions. Default is zero question marks. One genuine question is allowed in the whole CC only if it advances a weakness and is followed at once by the claim it implies. Never two in a row. | Convert to claim + evidence: "Why not Messick's matrix?" becomes "The authors do not say why Kane's framework suits research instruments better than Messick's matrix, which they present in Figure 1." |
| H4 | No invented facts. Every page number, quotation, figure number, count and statistic must be in the paper. | If the paper is not supplied, anchor by section or figure name and write `[p. ?]` for the user to fill. Never guess a page. |
| H5 | No vague attribution. No "many researchers", "the literature shows", "experts argue", "as pointed out by many researchers in the literature". | Name the source (author, year) or drop the claim. |
| H6 | Prose only inside the three sections. No bullet lists, no bold, no italics for emphasis, no emoji, no sub-headings inside a section. | Paragraphs. Italics only for titles of books or terms cited as terms. |
| H7 | Headings are the genre's own: the title block, then Summary, Strengths, Weaknesses (or the exact variants the course uses, for example "Major Strengths of the Article"). No summary-shaped headings ("Why the framework falls short"). | Keep headings as labels, not theses. |
| H8 | No meta-commentary or announcements: "In this commentary, I will...", "Let us now turn to...", "It is worth noting that...". | Start with the content. The heading already tells the reader where they are. |
| H9 | No hedge stacks. One qualifier per claim, and only on interpretive claims. | "may perhaps suggest" becomes "suggests" or "may". Verified facts take no hedge. |
| H10 | First person at most once in the whole CC, at the evaluative pivot, and only for a judgment that is genuinely the reviewer's. | Let the evidence carry the judgment: "to me, the examples were good" becomes "A worked calculation (p. 90) shows...". |
| H11 | No inserted errors, slang, fake autobiography or hidden Unicode to "seem human". | Write well. See section 7. |
| H12 | One spelling system (British or American) and one quotation-mark style throughout. Straight or curly, not both. | Match the user or the course; default to the system of the paper under review. |
| H13 | Name the genre correctly. A methods chapter, review or forum piece is not "this research paper" or "this study". | Use the genre line from the pipeline (Step 1): "this methodological review", "this forum article". |
| H14 | No closing paragraph that opens "In conclusion," or "Overall," and repeats earlier content. | End Weaknesses with a verdict that weighs and tells readers how to use the paper (section 4.8). |

---

## 2. Word lists

The lists are evidence-weighted, not magic. A single amber word proves nothing; clusters and stacking are the signal [D]. Lexical tells also decay as models change (Geng et al. 2026 [A]: newer models dropped "delve" and "intricate"; Juzek & Ward 2024 [A]: "boasts" faded, "underscore" rose). Treat structure (section 3) as more important than these tables. Do not flag a word because it is on a list; flag it because it does no work.

### 2.1 Red list: do not use in a CC

Base rates in human reviews for these were near zero [D]. Evidence: Juzek & Ward 2024, Kobak et al. 2024, Liang et al. 2024 (LLM-written peer reviews: "commendable" 9.8x, "meticulous" 34.7x, "intricate" 11.2x), Reinhart et al. 2024 [all A]; phrase items [C].

| Avoid | Plain replacement in a CC |
|---|---|
| delve / delves / delving into | examine, discuss, look at; or name what they did ("they test six inferences") |
| underscore(s) / underscoring | show, stress, confirm; often delete and state the fact |
| showcase(s) / showcasing | show, present, illustrate |
| pivotal | central, main, decisive; or say why it matters |
| crucial | important, necessary; or give the consequence |
| intricate / intricacies | detailed, complicated; or name the parts |
| interplay | relationship, how X affects Y |
| meticulous / meticulously | careful, carefully; or describe the care ("reports reliability for each subscale") |
| commendable / laudable / admirable | useful, careful, well chosen; or just state what was done well |
| noteworthy / notable (as praise) | delete; let the anchored fact show it |
| invaluable / indispensable | useful, needed; or say for whom |
| groundbreaking / cutting-edge / innovative (as praise) | new; or name what is new and relative to what |
| seamless / seamlessly | smoothly; usually delete |
| robust (outside statistics) | strong, well supported; or give the number |
| comprehensive grasp / comprehensive overview | broad survey of X; or give the scope ("covers six internal threats") |
| multifaceted / myriad / plethora | name the facets; many; the number |
| realm / landscape / tapestry / journey / beacon | field, area; usually delete the image |
| testament to / stands as a testament | shows |
| serves as / stands as / acts as / represents (for "is") | is |
| boasts | has |
| leverage / harness | use |
| foster / bolster / elevate / streamline / illuminate / unveil | encourage, strengthen, improve, simplify, explain, present |
| garner / garnered | get, receive, attract |
| paramount | most important; or rank the items |
| shed(s) light on | explains, clarifies, shows |
| paves the way for | makes possible, prepares for |
| plays a crucial / pivotal role in | affects, determines, helps |
| offers valuable insights into | shows, explains (then say what) |
| provides a nuanced understanding of | distinguishes X from Y |
| in the realm of / in the ever-evolving landscape of / in today's fast-paced world | delete |
| navigate the complexities of | handle, work through |
| it is worth noting that / it is important to note that | delete the frame and state the point |
| the authors are to be commended for | The authors [verb] |
| a significant contribution to the field | name the contribution and the readers who gain |
| a solid foundation for future research | name the study it makes possible |
| at its core / fundamentally / ultimately (as depth claims) | delete |
| when it comes to | delete; start with the noun |
| that being said | However, / Even so, |
| Last but not least | Finally, |

### 2.2 Amber list: allowed, but sparingly

Rule: at most one amber item per paragraph, never two in one sentence, never the same amber word twice in the CC. These do occur in human reviews at low rates [D: per 1,000 words, comprehensive 0.39, innovative 0.43, moreover 0.46, potential 0.46, findings 0.43, furthermore 0.21, valuable 0.18, insightful 0.14].

| Use sparingly | Better when you can |
|---|---|
| comprehensive | broad; "covers X, Y and Z" |
| valuable | useful for [named reader] |
| insightful | name the insight |
| compelling / convincing | well argued; "the case rests on X and holds" |
| timely | say what recent development makes it timely |
| thorough / thoroughly | detailed; "reports X for every Y" |
| particularly / notably | especially, or delete |
| significant (non-statistical) | large, important; reserve "significant" for statistics |
| highlight(s) | stress, point out |
| potential (as noun) | possible use, promise |
| enhance | improve |
| nuanced | name the distinction |
| moreover / furthermore / additionally | once per section at most; often a plain "also" or no connector works |
| judiciously | selectively, carefully |
| key (adjective) | main, central |
| effectively | well; or delete |

Note on the pipeline template: several of its fixed expressions contain amber words ("a timely and valuable contribution", "a compelling case", "draws judiciously"), and "notable" as praise is on the red list (2.1), so frames such as "several notable strengths" are excluded. Use at most one amber frame per CC, and prefer the anchored version: "The main strength is X (p. n), which lets readers Y."

### 2.3 Student-register slips (not AI tells, but they cap a CC below professor level)

Observed in the three course model CCs (pipeline_A, pipeline_B). They read as a novice reaction rather than a judgment.

| Slip | Professor version |
|---|---|
| As we all know | delete; state the fact with a source |
| Frankly speaking / to be honest | delete |
| to me, / for me, / I found ... interesting | state the property of the text |
| nice and neat / amazing / fantastic / outstanding job / really insightful | name the feature and its effect |
| a bit odd for me | "may reduce X" or "is unusual for the venue" |
| cure-for-all | "presented as suitable for every analysis" |
| likely to be spotted by meticulous critics | delete |
| took a strong case / went for / initiated with | made a strong case / turned to / began with |
| Like other papers, this paper had some flaws | Despite these merits, the article has three limitations |
| Maybe there exist major problems with it | delete speculation, or state the verified problem |
| "!!" | delete |

### 2.4 Discipline vocabulary that is never a tell

Keep exact terms and repeat them: construct validity, internal and external validity, effect size, confidence interval, statistical power, familywise error, random assignment, intact classes, quasi-experimental, delayed post-test, inter-rater reliability, rater severity, generalization inference, task complexity, uptake, CAF (complexity, accuracy, fluency), ecological validity, trustworthiness, transferability. Repeating a technical term is a service; rotating synonyms for it ("dependability", "consistency", "stability" for one reliability index) creates ambiguity.

---

## 3. Structural tells and their fixes

These matter more than vocabulary. Examples use the three course papers: Hudson and Llosa (2015, design), Purpura, Brown and Schoonen (2015, validity) and Mizumoto and Plonsky (2016, R; advance access 2015). Facts used here were checked against the papers or the pipeline manual.

| # | Tell | Why it reads as machine or template | Fix |
|---|---|---|---|
| S1 | Tricolon reflex: three adjectives or three parallel clauses, third item the weakest. LLM argumentative text carries about 7.1 tricola per document against 3.7 for expert humans [A, exploratory]. | Rhythm replaces evidence. | Count the items you can anchor. Use two, four, or one developed item. Max one triad per section. "The article is clear, comprehensive and insightful" becomes "Each of the six internal-validity threats comes with an L2 classroom scenario." |
| S2 | Participial tails and openers: "..., highlighting X", "..., underscoring Y", "Building on X, the authors...". Instruction-tuned models use present participial clauses at 2 to 5 times the human rate (GPT-4o 5.3x) [A: Reinhart et al.]. | Asserts a relation without arguing it. | Max one -ing clause per paragraph. Make it a second main clause: "Figure 2 sets out one inference as claim, warrant, rebuttal and backing, and readers can reuse that layout for their own instruments." |
| S3 | Uniform sentence length: every sentence 18 to 24 words, same subject-verb-object shape. | Narrow distribution is the default machine rhythm [C, checked against D]. | See section 6.2. Put the main flaw or the verdict in a short sentence after a long one. |
| S4 | "Not only X but also Y" and the negation reflex ("This is not merely a tutorial; it is a manifesto"). | Manufactured contrast; both halves usually true. | State both claims plainly, or delete the negated half. "The article covers both design families and their threats." |
| S5 | Hedge stacks and performed hesitancy: "It could perhaps be argued that the sample may somewhat limit...". LLM text carries performed epistemic markers at about twice human density [A, exploratory]. | Caution with no content. | One hedge, tied to a reason: "Because the exemplar is a single, unusually well-documented study, the demonstration may not show how the framework handles thinner reporting." |
| S6 | Summary-style closers: a last sentence that restates the paragraph ("Overall, these strengths make the article a valuable contribution to the field."). | Adds no noun the paragraph lacked (imf2-tells-1 test). | Delete it, or replace with a sentence that adds a reader and a use: "Researchers planning a first validation study can lift the Appendix checklist almost unchanged." |
| S7 | Formulaic signposting: "Firstly... Secondly... Thirdly... Lastly" across four or more points; "In this section"; "Let us now consider". | Cohesion that attracts attention. | Choose one sequencer family and use it lightly. Two "First" / "A further" markers are enough; the logic should come from contrast and consequence. |
| S8 | Symmetrical paragraphs and symmetric coverage: every strength one sentence, every weakness 70 words. | Visual balance instead of judgment. | Uneven on purpose: the main flaw gets two to three times the words of a minor one. A minor point may be one sentence. |
| S9 | Over-balanced "While X, Y" / "Although X, Y" everywhere. | A concession that concedes nothing, used as a template. | Concessive pivot once per weakness block at most, and only when the concession is real and anchored: "The authors concede the package's steep learning curve, yet close by calling it 'the preferred package of researchers in the 21st century'." Vary with two plain sentences. |
| S10 | Copula avoidance: "serves as", "stands as", "represents", "boasts". | Systematic preference for inflated verbs (imf2-tells-1). | "is", "has". The sentence usually shortens by a third. |
| S11 | Nominalization chains: "The provision of a justification for the selection of the exemplar study is absent." Nominalizations 1.5 to 2.1x human rate [A: Reinhart]. | Hides who did what. | Actor + verb: "The authors explain why they chose the exemplar (p. 40), but not what that choice leaves out." Keep nouns that are technical terms (validation, regression). |
| S12 | Elegant variation: the authors / the researchers / the scholars / the writers; article / paper / study / manuscript / piece / work. | Breaks reference chains and blurs genre. | One name for the authors (surname pair or "the authors"), one name for the text that fits the genre. |
| S13 | Additive-only logic: Moreover, In addition, Another, Furthermore, Finally. The three model CCs used zero contrast and zero consequence connectors in 2,560 words (pipeline_B). | Reads like a shopping list. | In Weaknesses, at least two contrast markers (however, although, yet, but) and one consequence marker (as a result, so, therefore, this means) where the logic needs them. Moreover/Furthermore/Additionally once per section at most [D]. |
| S14 | Over-coverage and convergence: many generic points any paper could receive. Fully AI reviews carry about 32 claims against 23 for human reviews, and different models converge on the same points [A: Sem-Detect]. | Generic coverage is the signature, not length. | Three to four strengths, three to five weaknesses, each tied to something only this paper contains. |
| S15 | Grandiose summative sentences and significance inflation: "This article stands as a testament to the transformative potential of open-source tools in the evolving landscape of applied linguistics." [A: Reinhart]. | Positive abstract words plus relational nouns, no claim. | Replace importance with the fact that makes it important: "The article gives L2 researchers a concrete reason to try R: langtest, a free web application, runs common analyses without SPSS." |
| S16 | Uniform confidence: the same certainty for page-verified facts and for interpretations. | Flat stance. | Facts unhedged and specific; interpretations hedged once with a reason; open questions named as open. |
| S17 | Vague attribution and citation dumping. | Unverifiable. | Name author and year, or drop. One source discussed beats four listed. |
| S18 | Hourglass shape and tidy resolution: opens with a synthesis, closes with a synthesis, every issue resolved. | Real critique leaves something open. | Let the verdict weigh, then stop. It is fine to end on an honest limit: "Whether the framework diagnoses weaker studies remains to be shown." |
| S19 | The challenges turn: "Despite these minor limitations, the article remains an excellent resource." | Concedes nothing specific. | Name the limitation that most affects use, then the reader for whom the paper still works. |

---

## 4. What makes CC prose read as a real professor

### 4.1 Specificity carries the judgment
Every evaluative sentence in Strengths and Weaknesses points at something only this paper has: a page, section, figure, table, count, statistic or short quotation (two or three quotations in the whole CC, each under about 15 words, each with a page). Human writers name specifics at about twice the AI rate (StoryScope via imf2-tells-1 [A]). Compare "The authors used understandable examples" with "A worked calculation (p. 90) shows that six uncorrected comparisons raise the chance of a false positive to about 26%." (Check the page against the paper before using any example like this.)

### 4.2 Uneven emphasis
Spend the most words on the weakness that most affects the paper's own aim, and say so: "The most serious limitation is the balance of the argument." Minor genre points (keywords, a repeated paragraph) get one sentence at the end, or are cut. Ranking by consequence is the clearest signal of an experienced reader (pipeline Step 9).

### 4.3 An occasional short sentence
At least one sentence under 10 words per page, placed where the point should land: after the long sentence that sets up the main flaw, or as the verdict. "The comparison is not like for like." Do not chop a reasoned sentence into fragments: L2 readers need the connectives (Blau 1982 via imf2-craft-1). Shorten sentences, keep "although", "because", "so".

### 4.4 Measured first person
At most once, at the pivot where the judgment is personal and the reader needs to know it is: "I was less persuaded by the choice of a single exemplar." Never "to me" in a list of praise. Do not remove all agency either: name the authors as actors when criticising ("The authors do not report effect sizes"), and use ordinary agentless passives where the actor is irrelevant ("Learners were tested twice") [A: Reinhart, LLMs underuse agentless passives].

### 4.5 Discipline vocabulary used naturally
Use the field's terms without explaining them to the expert reader, and use them exactly. A professor writes "the treatment was confounded with teacher, since each condition was a different intact class", not "there may have been various external factors". One precise term replaces a sentence of paraphrase.

### 4.6 Reporting verbs varied and matched to the move
No reporting verb more than twice in the CC. Pick by what the authors are doing, and by how much you accept it (pipeline_A 7.1):

| Move in the paper | Verbs |
|---|---|
| Neutral content | describe, outline, present, introduce, review, trace, survey |
| Defining or listing | define, distinguish, identify, catalogue, group |
| Arguing a position | argue, contend, maintain, make the case that, propose |
| Explaining with examples | explain, illustrate, exemplify, walk through |
| Admitting a limit | acknowledge, concede, note, recognise |
| Closing | conclude, recommend, call for, close with |
| You accept the point | show, demonstrate, establish |
| You doubt the point | claim, assert, present X as |

Do not use "argue" for a definition, or "demonstrate" for a claim you later criticise.

Tense: pick one system and keep it. Default for WRITE mode: present for what the text says ("the authors argue"), past for what a reported study did ("Revesz (2012) used three outcome measures"). The course model CCs narrate the paper in the past tense ("they argued"); that is acceptable when consistent, and in REVISE mode it is preserved.

### 4.7 Honest hedging tied to a reason
The test (imf2-academic-2): does removing the hedge change what the sentence claims? If not, remove it. Hedges that always do work: scope ("for a chapter-length overview"), evidential ("the figure suggests"), alternative-preserving ("though a ceiling effect cannot be ruled out"), measurement ("about 26%"). Hedges that almost never work: stacked modals, "it could be argued" (by whom?), "somewhat", "relatively", apologetic frames before a finding. Put the reason in the sentence: "With one intact class per condition, teacher effects cannot be separated from the treatment."

Persian-L1 transfer note (Ahmadi 2022; Rahimpour and Faghih 2009, via imf2-academic-2): Persian research writing tends to express stance with attitude markers ("Unfortunately", "Surprisingly", "It is regrettable that") where English academic prose expects hedges and evidence. Prefer "The sample of 40 limits the precision of the estimate" to "Unfortunately, the sample was small."

### 4.8 Concession that costs something, and a verdict with a reader
Credit what the authors did say before pushing further: "Although the authors note X (p. n), they do not Y." This is sharper and fairer than "they ignore X". End the Weaknesses section with a verdict that weighs the limits against the merits and names who should read the paper for what: "Read with a design textbook beside it, the chapter remains a sound first guide for L2 researchers planning an intervention."

### 4.9 Fewer, deeper points
A natural CC makes fewer points than a generated one, and develops each: claim, evidence, consequence, alternative (CECA). Two well-built weaknesses beat six thin ones.

### 4.10 One plain statement
Somewhere in the CC, say one thing plainly without elaboration. "The advice itself is correct." "The comparison is not like for like." Restraint reads as confidence.

---

## 5. Voice targets

| Mode | Target voice |
|---|---|
| WRITE (default) | Seasoned AL professor: calm, specific, present tense for the text, at most one first person, contrast and consequence logic, varied reporting verbs, three to four strengths and three to five weaknesses with remedies. |
| WRITE in the user's style (on request, from a sample) | Measure the sample before imitating (imf2-craft-1 audit): mean sentence length and its spread, first-person rate, tense, connector habits, hedges, punctuation, what the writer never does. Match the two largest divergences only. The course model CCs, for example, show past tense narration, some first person, and additive connectors (Moreover, In addition, Another, Finally); a style match may keep the tense and an "In addition" while still adding the contrast connectors the logic needs. |
| REVISE | The user's voice wins. Apply `scoring-and-revision.md`. Preserve vocabulary, rhythm, spelling system, consistent tense and first-person choices. Fix errors; leave the merely unusual (imf2-craft-3: "Fix errors. Leave the unusual."). |

---

## 6. Final self-audit (run before outputting any CC you wrote)

### 6.1 Twelve-point checklist
Run each item; fix and rerun until all pass. Report nothing about this audit to the user unless asked.

1. **Dash scan.** Search the text for U+2014, U+2013, " - " used as a dash, and "--". Count must be zero.
2. **Punctuation.** Zero "!". Zero "?" (or exactly one, justified under H3). No trailing ellipses.
3. **Red list.** Zero hits from 2.1. Amber items from 2.2: at most one per paragraph, never repeated in the CC. Zero student slips from 2.3.
4. **Anchors.** Every evaluative sentence in Strengths and Weaknesses (except the section opener and the verdict) has an anchor: page, section, figure, table, count or short quote.
5. **Verification.** Every anchor, quotation, number, name and claimed absence was checked against the paper. Absences were searched with the item plus two synonyms (pipeline Step 8). If the paper is absent, every unverifiable anchor is marked `[p. ?]`.
6. **Summary fidelity and neutrality.** No evaluative word in the Summary (insightful, beautifully, fantastic, useful). No reversed negation or certainty (check every "should not", "only", "rarely"). No string of more than four or five words copied without quotation marks.
7. **Structure tells.** At most one triad per section; at most one -ing tail per paragraph; no "not only... but also"; concessive "While/Although X, Y" openers at most once per weakness block; no copula inflation (serves as, stands as).
8. **Uneven emphasis.** The first weakness is the most consequential and the longest. At least one minor point is short or cut. Weaknesses section is longer than Strengths.
9. **Hedges and stance.** No hedge stack; every hedge sits on an interpretive claim and carries its reason; verified facts unhedged; first person at most once; no attitude markers doing the work of evidence.
10. **Connectors and cohesion.** Weaknesses contain at least two contrast and one consequence connector. Moreover/Furthermore/Additionally at most once per section. No "Last but not least". One name for the authors, one genre label for the text, one term per concept.
11. **Closers and verdict.** No paragraph ends by restating itself. The Weaknesses section ends with a verdict that names a reader and a use. No "In conclusion" paragraph.
12. **Voice and form.** Reporting verbs varied (none more than twice) and matched to the move; tense consistent; spelling system consistent; genre named correctly; proportions within the template (Summary about 40%, Strengths 20 to 25%, Weaknesses about 35%); sentence-length check (6.2) passed.

### 6.2 Sentence-length variation check
For each section, list the word count of every sentence in order, then check:

- At least one sentence of 10 words or fewer and one of 30 or more per page (about 450 to 500 words).
- No run of four consecutive sentences whose lengths all fall within a 5-word band (for example 19, 21, 18, 22).
- No sentence over 45 words; a 45-word sentence is almost always two.
- No more than a third of the sentences in a paragraph begin with the same word ("The", "They", "This").
- Soft target: coefficient of variation (SD divided by mean) of about 0.45 or more for the whole CC. Human reviews measured 0.40 to 0.67 (mean about 0.52, mean sentence length 18 to 33 words) [D]; the vendor threshold of 0.4 [C] would misflag some real reviews, so never present this number to the user as a detector score.

Vary length where the meaning calls for it (a short sentence for the main flaw or the verdict, a long one for a reasoned concession). Never vary at random to hit a number. A minimal counter, if a script runner is available:

```python
import re, statistics as st
s = [x for x in re.split(r'(?<=[.?!])\s+', text.strip()) if x]
n = [len(x.split()) for x in s]
print(n, round(st.mean(n), 1), round(st.pstdev(n) / st.mean(n), 2))
```

---

## 7. Honest note: reader-facing quality, not detector evasion

The purpose of this protocol is a CC that a professor, an editor or the reviewed authors would read as careful, specific and fair. It is not a tool for defeating AI detectors, and it should never be described to the user as one.

The evidence supports this position:

- GPT detectors misclassified more than half of TOEFL essays written by non-native speakers as AI (average false positive rate 61.22%) while almost never flagging US eighth-grade essays; asking ChatGPT to "enhance the word choices to sound more like a native speaker" cut false positives to 11.77% [A: Liang et al. 2023]. Plain L2 vocabulary is punished, and "elevated" vocabulary is what imports tell-words. So never sophisticate a user's vocabulary to look human.
- The same study found that a self-edit prompt to "elevate" the text dropped detection of ChatGPT essays from 100% to 13% [A]. Evasion is trivial, so it is not a quality signal.
- All human-written translated or paraphrased essays by Malay, Mandarin and Japanese writers were flagged in one study (Wee et al. 2023), and readability tools such as Grammarly raised false positives for non-native writers (Bordalejo et al. 2025) [both via imf2-tells-3, not re-verified]. Public detectors were judged "neither accurate nor reliable" (Weber-Wulff et al. 2023, via imf2-tells-3).
- No single stylistic sign is proof of authorship (Wikipedia AI-cleanup editors, via imf2-tells-3). This skill names properties of a text; it never issues an authorship verdict on anyone's CC.

Therefore: do not insert errors, do not manipulate Unicode or punctuation to shift a score, do not invent drafts or process history, and do not claim a text is human-written. The user is responsible for following their course or journal policy on AI assistance; if they ask, help them describe the assistance they actually used.
