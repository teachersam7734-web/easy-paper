# Easy Paper master prompt

Paste this with the paper attached (or a path to it). Tick or edit the options; anything left blank falls back to the defaults shown.

```text
EASY PAPER: study this paper for me.

PAPER: [attached file / path / DOI]
COURSE OR CONTEXT (optional): [e.g. MA Applied Linguistics, ISLA course, session 7]
DEADLINE / TIME I HAVE (optional): [e.g. presenting Tuesday / exam in 2 hours]

1) MODES (choose any; default = the one that fits my deadline):
   [ ] Deep Dive        5-10 pages, presentation-ready mastery + gaps and newer research
   [ ] Critique         3-5 pages, speakable strengths/weaknesses, 90-second script, examiner Q&A
   [ ] Review Guide     exactly 4 pages, 80/20 cram guide with mind map and 2-hour plan
   [ ] Vocab Treasure   1-2 cinematic pages of C1-C2 academic language to reuse
   [ ] All four

2) ADHD QC before delivery? (ADHD Auditor + Distracted Reader check every PDF and adjust it)
   [ ] Yes   [ ] No   (default: Yes)

3) MEMORY LINKS for lists, typologies and heavy definitions?
   [ ] Yes   [ ] No   (default: Yes)

4) INTERACTIVE APPLICATION (Mord'Sith: four ADHD-QC-passed outputs in one offline HTML app)?
   [ ] No   (default)
   [ ] Yes, theme:  [ ] Agiel (dark, crimson-neon, sharp HUD)
                    [ ] Confessor (luminous, editorial, calm)
                    [ ] Seeker (kinetic, with optional focus music)
   An interactive app uses all four modes and requires ADHD QC on each.
   If no theme is marked, use Confessor.

5) STUDY BUDDY afterwards? (ADHD Student guides me through the outputs with prompts and a timer)
   [ ] Yes   [ ] No

Rules: English output; byline "Sajjad Irani"; verify every quote, number and page;
no invented citations; deliver each PDF with one line of context and tell me the order to study them in.
```

## How Claude runs it
1. Load `easy-paper-core` and extract the paper. Build the dossier once when the selected study guides need it.
2. Run the selected pipelines, sharing the dossier across the study guides. Mine Vocab Treasure directly from the source. If an app is requested, prepare all four modes.
3. Run the ADHD Student QC on requested PDFs when enabled. An app requires all four to pass. Clarify any explicit request for an app with ADHD QC off.
4. If the app is requested, run `/easy-paper:mordsith` with the chosen theme and the four reviewed outputs. Deliver the standalone HTML and the PDFs the learner requested.
5. If Study Buddy = Yes: `adhd-student` job 1, starting with the recommended study route for the deadline.

## Defaults when the user just says "study this"
- Deadline under 48 hours: Review Guide + Vocab Treasure, ADHD QC on.
- Presentation: Deep Dive + Critique, ADHD QC on.
- No deadline given: ask one question (which mode), or run all four if the user cannot answer.
