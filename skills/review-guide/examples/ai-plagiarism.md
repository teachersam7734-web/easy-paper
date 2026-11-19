# AI vs AI Plagiarism (Ibrahim, 2026) · Review Guide

By Sajjad Irani.

> Recovered from the approved PDF, AI vs AI Plagiarism (Ibrahim, 2026) - Review Guide.pdf. The original carries the exact layout, illustrations and wording. This reading copy preserves the visible PDF page order.

## Output page 1

```text
      EASY PAPER                                                 REVIEW GUIDE

      CASE FILE: CAN AI CATCH AI? · REVIEW GUIDE · 2-HOUR CRAM
      Using AI to control AI-assisted plagiarism in L2 writing: a critical
      review of the literature

      Karim Ibrahim (2026)

        2-hour plan 80/20 4 engines, 3 criteria, 1 rule             By: Sajjad Irani

             The big picture
       PAGE 1                                                    Read this first · 10 min

            PREVIEW QUESTIONS
            Guess an answer to each before you read on. Being wrong first makes the right answer stick.

            P1 What would make an AI detector good? Guess P2 How could software tell AI writing from human
               three qualities.                writing? Name any two ways.
            P3 What happens to detector accuracy when AI P4 Should a teacher decide a plagiarism case
               text is paraphrased several times? from one detector score?

         1 Why it matters
        AIAP: improper use of generative
        AI
                                                          5 AICEF verdict
        Turnitin caught only 54.8%
                                                         Reliability, generalizability,
                                                         accessibility p. 13
                                                         Fine-tuned RoBERTa best, but
         2 How he reviewed                               opaque
        Critical review, no data of its own
        57 found, 33 kept
                                     CENTRAL IDEA         6 So what
                                   Fight AI With AI
                                                         Never decide on a score alone
         3 Four detector types     No detector is safe alone; p. 16
                                       layer them        Layer detectors; redesign tasks
        Watermark, training, statistical,
        retrieval p. 4
        Detector = product; classifier =
        engine                                            7 Limits
                                                         Many preprints; commercial tools
                                                         untested
         4 The enemy                                     No false-positive data (our
                                                         critique)
        Paraphrasing beats every
        approach p. 15
        Watermark 97% falls to 15%
          IF YOU REMEMBER ONE THING
          No AI detector is accurate enough to judge plagiarism alone. Know the four engines, rate them on three
          criteria, and follow one rule: combine tools with your own judgment.
          GOLD NUGGETS
          No detector decides alone. Use detectors as one of many resources p. 16 .
          Four engines: watermarking, training-based, statistical, retrieval-based (Lu et al., 2023) p. 4 .
          AICEF = three criteria: reliability, generalizability, accessibility p. 13 .
          Paraphrasing is the master key: a watermark fell from 97% to 15% p. 6 .
          Best engine, worst explainer: RoBERTa, about 95%, gives no reasons pp. 14-15 .

     EASY PAPER · REVIEW GUIDE · AI vs AI Plagiarism (Ibrahim, 2026)  By: Sajjad Irani · 1/4
```

## Output page 2

```text
             Must-knows   (1/2)
       PAGE 2                                                  The 3-star items · 35 min

            HUNT QUESTION ★★★ 1 p. 13 9 min
            What is the AICEF, and what are its three criteria?

         SHORT ANSWER Ibrahim's three-part yardstick for any classifier: reliability, generalizability, accessibility.
          Memory Link: Trust it? Take it anywhere? Afford it? (our hook, same order as R, G, A)

         AICEF CRITERION PLAIN QUESTION WHAT IT MEANS P. 13

         Reliability  Can I trust it?  Accurate on plain and disguised AI text, even short, without spoiling it
         Generalizability Does it work anywhere? Works across different LLMs, text types and domains
         Accessibility Can I afford and run it? Available, affordable and practical to deploy

            HUNT QUESTION ★★★ 2 pp. 3-5 9 min
            What are the four engines inside AI detectors, and how does each decide?

         SHORT ANSWER Watermarking finds a hidden pattern; training-based models learn from labelled texts;
         statistical checks test predictability; retrieval matches past AI outputs.

          Memory Link: one exam-office scene, a stamp, a sniffer dog, a meter, an archive (our hook)

                                                              MAIN WEAKNESS
         IMAGE     ENGINE      HOW IT DECIDES
                                                               P. 12
         Stamp     Watermarking Finds a pattern the AI hid while writing Distorts text
         Sniffer dog Training-based Learned from labelled AI and human texts Overfits
         Meter     Statistical Checks how predictable the words are Less accurate
         Archive   Retrieval   Matches meaning to this LLM's past outputs Needs its database

            HUNT QUESTION ★★★ 3 pp. 5-15 9 min
            What is an adversarial attack, and how badly does paraphrasing hurt detection?

         SHORT ANSWER An attack disguises AI text. Paraphrasing, above all when repeated, beats every approach.

                                             Accuracy after paraphrasing (%)
         1 Outfit         2 Glitter
         Paraphrase: new  Insertion: junk symbols DetectGPT, from 70.3
                                                                       4.6
         words                              p. 11
                                           Watermark, from 97 p. 6     15
                                           Retrieval, from 100 p. 12   25
         3 Name tags      4 Actor
                                           RoBERTa, from 100 p. 9      60
         Substitution:    Generative: sound
                                           Different studies and set-ups: read the direction only.
         synonyms         human
            HUNT QUESTION ★★★ 4 pp. 15-17 8 min
            What is the ideal detector, and what must teachers do with a score?
         SHORT ANSWER A hybrid, multi-layered one. Never decide on a single score: consult several detectors, test
         600+ words, judge for yourself.
         1                 2                3                 4

         Fine-tuned       Statistical       Semantic          Teacher
         Accuracy         Explains the flag Resists paraphrase Final call
        Use AI against itself, but the teacher decides pp. 16-17.

     EASY PAPER · REVIEW GUIDE · AI vs AI Plagiarism (Ibrahim, 2026)  By: Sajjad Irani · 2/4
```

## Output page 3

```text
             Must-knows   (2/2)
       PAGE 3                                            2-star items, numbers, hooks · 30 min

            HUNT QUESTION ★★ 5 pp. 13-16 4 min  HUNT QUESTION ★★ 7 pp. 3-4 4 min
            Why prefer fine-tuned RoBERTa, and  What kind of paper is this, and how were
            what is the catch?                  studies picked?

         SHORT ANSWER It is the most accurate but opaque. SHORT ANSWER A critical review with no data of its
         Statistical tools are weaker but transparent. own. Four databases, 57 found, 33 kept.
                                              1
                   Fine-tuned Statistical    4 databases
                   RoBERTa    (GLTR)         Searched 2024 and 2025 p. 3

         ACCURACY  About 95%  Lower           2
                    p. 15                    57 to 33
                                             Criteria A to E p. 4
         EXPLAINS? No p. 14   Yes p. 16
                                              3
            HUNT QUESTION ★★ 6 pp. 2-3 4 min 4 types
            What is AIAP, and why are detectors a Rated on the AICEF
            problem?
                                                HUNT QUESTION ★★ 8 pp. 17-18 4 min
         SHORT ANSWER Detectors miss a lot, fail under Besides detectors, what should teachers
         disguise, and may be biased against ESL writers.
                                                change?
                                             SHORT ANSWER The task: grade the process, not
            VERBATIM DEFINITION
                                             just the product.
            AI-assisted plagiarism (AIAP)
             “the improper use of generative AI
                                             Process          Talk
             capabilities to complete academic
                                             Dynamic assessment Discussions,
             assignments”
                                              p. 17           interviews
             Ibrahim, 2026, p. 2
            IN PLAIN WORDS Handing in AI work when
            the rules forbid it.             Personal         Lock down
                                             Own-experience   Paper tests p. 17
                                             prompts
        Numbers worth memorising
       NUMBER      MEANING                                           PAGE
       54.8%       AI essays Turnitin caught (Perkins et al., 2023) p. 2
       99.6%       Watermark on clean text (Kirchenbauer et al., 2023) p. 5
       97 → 15%    Same watermark after five paraphrases            p. 6
       70.3 → 4.6% DetectGPT after one paraphrase                   p. 11
         4, 3, 1                 Car and engine          Two doctors

       Four engines, three criteria, one Detector = car brand; classifier = RoBERTa is right but silent; GLTR
       rule. The coach's hook. engine. Our hook.       shows its working. Our hook.

        Don't mix these up

       A                B                    THE DIFFERENCE
       Detector         Classifier           Product vs the engine inside it p. 3

       AICEF reliability Test reliability (outside) Right and robust vs consistent scores p. 13
       99.6% watermark  "Unreliable" watermark Clean-text accuracy is not robustness pp. 5, 13

     EASY PAPER · REVIEW GUIDE · AI vs AI Plagiarism (Ibrahim, 2026)  By: Sajjad Irani · 3/4
```

## Output page 4

```text
             Exam  ready
       PAGE 4                                                    Test yourself · 45 min

        Likely exam questions
                                              Your 2-hour game plan 120 min
         Define AIAP; name the AICEF criteria. 10′ Page 1: guess the previews; read the map
       Improper use of generative AI p. 2 ; reliability, aloud
       generalizability, accessibility p. 13 . 35′ Page 2: cover each short answer, say it back
                                              25′ Page 3: numbers, hooks, the three pairs
         Why is no single approach enough?    15′ Blind recall: redraw the mind map

       All break under paraphrase; the best cannot explain 20′ Page 4: exam questions aloud, then the quiz
       itself pp. 14-16 .                     15′ Fix misses. Tomorrow: redo the quiz (5 min)

         An essay is flagged 85% AI. What next?
                                              BLIND RECALL CHECK
       No verdict from the score: more engines, 600+ words,
                                              Cover pages 1 to 3 and say 4, 3, 1 aloud: the
       a talk pp. 16-17 .
                                              four engines, the three AICEF criteria, the one
                                              rule. Then name the four attacks in order.
         One strength, one weakness?
       Clear taxonomy pp. 4-12 ; but names untested
       products pp. 17, 19 .
          Wrap-up quiz                      Answer all eight, then check the key at the bottom of this page.
        Q1 Which set names the three AICEF criteria? CHOOSE ONE
          A. Reliability, generalizability, accessibility B. Robust, blind, scalable
          C. Accuracy, precision, recall

        Q2 True or false: in this paper, a classifier is the product teachers buy, such as GPTZero. TRUE OR FALSE

        Q3 Which approach fell from 100% to 25% after five rounds of paraphrasing? ANSWER IN A SENTENCE

        Q4 Which approach does the AICEF rate most reliable, and its drawback? ANSWER IN A SENTENCE
        Q5 A 300-word essay is flagged 85% AI. What should the teacher do? APPLY IT

        Q6 A school wants flags it can explain. Which approach, at what cost? APPLY IT

        Q7 Watermarking hit 99.6% on clean text, yet the AICEF calls it unreliable. Why? CHOOSE ONE
          A. The figure was withdrawn     B. Reliability also counts robustness and text quality
          C. Reliability means consistent scores

        Q8 Which is a fair weakness of how the review used its selection rules? CHOOSE ONE
          A. It excluded every preprint   B. Its 2022 to 2025 rule, yet it cites Hovy (2016)
          C. It searched only one database

        Answer key: Wrap-up quiz
      Q1 A. Reliability, generalizability, accessibility Ibrahim merged three taxonomies into these labels pp. 12-13 .
      Q2 False. The classifier is the engine inside a detector. Detectors are services; classifiers power them p. 3 .

      Q3 Retrieval-based classification. It held about 97% after one paraphrase, then fell to 25% p. 12 .
      Q4 Fine-tuned RoBERTa; it gives no explanation for its decisions. Top reliability p. 13 ; gives no reasons p. 14 .
      Q5 No verdict from the score: more detectors, 600+ words, Detectors are one resource among pp. 16-17 .
         judgment.                            many
      Q6 Statistical (GLTR): transparent, but less accurate and fragile. Clear criteria help justify decisions pp. 15-16 .

      Q7 B. Reliability also counts robustness and text quality It distorts text and collapses under paraphrasing pp. 5, 13 .
      Q8 B. Its 2022 to 2025 rule, yet it cites Hovy (2016) Criterion D p. 4 ; Hovy (2016) p. 7 .

     EASY PAPER · REVIEW GUIDE · AI vs AI Plagiarism (Ibrahim, 2026)  By: Sajjad Irani · 4/4
```
