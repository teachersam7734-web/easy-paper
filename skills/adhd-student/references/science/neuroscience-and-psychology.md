---
name: neuroscience-and-psychology
description: The science of ADHD as it relates to learning (diagnosis, executive function, working memory, reward and delay, default mode network, time, hyperfocus, emotion, university outcomes, learning strategies, treatment landscape), each with plain explanation, evidence strength and a study-design implication; read before designing or reviewing any ADHD-friendly study material.
---

# Neuroscience and psychology of ADHD, for study design

This file explains what research says about ADHD and learning, how strong each claim is, and what it implies for how study pages and AI prompts should be built. Citations are in `../sources/academic-science.md` (author-year here, full APA 7 with DOI there).

Not medical advice. This is a design reference, not a diagnostic or treatment guide. Medication appears only in general terms, with no dosing.

## How to read the evidence labels

| Label | Meaning |
|---|---|
| Strong | Replicated meta-analyses or large RCTs, consistent direction |
| Moderate | Several good studies or reviews, some inconsistency or mostly child samples |
| Emerging | Few studies, small samples, or theory ahead of data |
| Practice wisdom | Widely used by clinicians and coaches, little or no direct trial evidence |

Two cautions run through everything below:

1. ADHD is heterogeneous. Group averages describe groups. No single deficit (executive, reward, timing) is found in every person with ADHD (Willcutt et al., 2005; Sonuga-Barke, 2003).
2. Most mechanistic research uses children. Where adult or student evidence is thin, the text says so.

---

## 1. What adult ADHD is: the DSM-5-TR picture

**Plain explanation.** ADHD is a neurodevelopmental condition defined by a persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning. It is diagnosed by clinical assessment, not by a quiz or a brain scan (American Psychiatric Association, 2022).

Key points of the DSM-5-TR criteria:

- Two symptom lists of nine items each: inattention (for example loses focus, makes careless errors, avoids sustained mental effort, is disorganized, loses things, is forgetful, is easily distracted) and hyperactivity-impulsivity (for example fidgets, restless inside, talks excessively, interrupts, has difficulty waiting).
- Adults (17 and older) need five or more symptoms in a list. Children need six.
- Several symptoms were present before age 12.
- Symptoms appear in two or more settings (for example study and home), last at least six months, and clearly reduce functioning.
- They are not better explained by another condition (anxiety, depression, sleep problems, substance use, and others can mimic or co-occur).
- Presentations: predominantly inattentive, predominantly hyperactive-impulsive, combined. Presentations can change over life. Specifiers cover partial remission and severity (mild, moderate, severe).
- In adults, hyperactivity often turns inward (inner restlessness, racing thoughts) while inattention and disorganization persist.

**Prevalence.** Meta-analyses estimate roughly 2.5 percent of adults meet criteria in older pooled data (Simon et al., 2009). A later global meta-analysis separates persistent adult ADHD (childhood onset that continued) from symptomatic adult ADHD, with the second figure higher (Song et al., 2021). Exact percentages vary by method, so the skill should say "a few percent of adults" and avoid quoting a single number as fact.

**Common co-occurring conditions.** Anxiety, depression, sleep problems, specific learning difficulties and autism-spectrum traits co-occur at elevated rates in ADHD (Franke et al., 2018). Co-occurrence matters for study design because it adds load that the design cannot see.

**Evidence strength.** Strong for the criteria and general prevalence range; moderate for precise adult figures.

**What this means for study design.**
- Never label a reader or claim to diagnose. Use "if attention and organization are hard for you" language.
- Design for the nine inattentive items directly: forgetting, losing the place, avoiding sustained effort, disorganization, distractibility. Each should have a page-level counter (see design-principles-from-science.md).
- Offer an "inner restlessness" path (move, switch task type) not only a "sit still" path.

---

## 2. Executive-function models

### 2.1 Barkley's self-regulation model

**Plain explanation.** Barkley (1997) argued that the core problem is weak behavioral inhibition, which then impairs four executive functions: nonverbal working memory (holding events and plans in mind), internalized speech (talking yourself through steps), self-regulation of emotion, motivation and arousal, and reconstitution (breaking behavior into parts and recombining). The result is poor control of behavior by internal representations of time and goals. Barkley's later work (2012) frames executive function as self-regulation across time: people with ADHD act on what is near in time and are guided less by future consequences.

**Evidence.**
- Executive function weaknesses are real and moderate in size at the group level, but they are neither necessary nor sufficient for the diagnosis. A substantial subset of people with ADHD show normal executive test performance (Willcutt et al., 2005).
- A review of 34 meta-analyses found ADHD groups perform worse than controls across many neurocognitive domains, with a mean standardized difference of about 0.45 and largest effects for working memory, reaction time variability, response inhibition and planning/organization (Pievsky & McGrath, 2018). Funding source moderated effect sizes, so treat the exact magnitudes cautiously.

**Evidence strength.** Strong that group-level executive weaknesses exist; moderate as a complete explanation of ADHD (it is not).

**What this means for study design.**
- Treat executive functions as things the page can lend: the page holds the plan, the sequence, the place-keeping and the time cues so the reader does not have to.
- Use externalized speech: a consistent "Next step" line and short self-instruction prompts (externalizing the inner voice Barkley describes).

### 2.2 Brown's model

**Plain explanation.** Brown (2013) describes executive function as six clusters that work together: activation (getting started, organizing, estimating time), focus (sustaining and shifting attention), effort (regulating alertness, sustaining effort, processing speed), emotion (managing frustration and mood), memory (working memory and recall), and action (monitoring and self-regulating action). It is a clinical, descriptive model, rooted in how adults with ADHD report their difficulties.

**Evidence.** Brown's model is clinically influential but has less direct experimental validation than Barkley's. Treat the six clusters as a useful checklist, not as tested scientific categories.

**Evidence strength.** Practice wisdom to emerging (as a model); strong overlap with measured domains.

**What this means for study design.**
- Use the six clusters as a design audit: does this page help with activation (a tiny first step), focus (one thing at a time), effort (a stop point), emotion (a calm reset), memory (cues and recall), action (a checkpoint)?
- The "tiny first step" is the single most important activation feature for adults who say "I know what to do but cannot start".

---

## 3. Working memory

**Plain explanation.** Working memory is the small mental workspace that holds and manipulates information for a few seconds to minutes: keeping a sentence's subject in mind until the verb arrives, holding three conditions while reading the fourth, remembering a task while a distraction interrupts.

**Evidence.**
- Meta-analyses in children find working memory deficits across verbal and spatial tasks with moderate-to-large effects, larger when the task demands manipulation, not only storage (Martinussen et al., 2005; Kasper et al., 2012).
- Working memory sits among the largest deficits in the neurocognitive review of meta-analyses (Pievsky & McGrath, 2018).
- Adult-specific meta-analytic evidence for working memory is thinner than for children, but the direction is the same. Treat adult claims as moderate.
- Training programs that drill working memory do not reliably transfer to everyday ADHD symptoms or academic outcomes (Rapport et al., 2013; Cortese et al., 2015). So the fix is not to train the workspace but to reduce what the page asks of it.

**Evidence strength.** Strong that deficits exist (mostly child data); strong that training does not transfer well; the design inference (reduce load) is supported by general cognitive load theory (Sweller, 1988).

**What this means for study design.**
- Every chunk opens with its answer or point, then supports it. The reader should never hold an unresolved question across paragraphs.
- Keep each chunk to a few new ideas, define a term where it first matters, and repeat the one-line definition when it returns far from the first use.
- Put a running "what I know so far" box at chunk boundaries; do not require the reader to carry it.
- Avoid long conditionals and nested qualifications; use bullets and numbered steps.

---

## 4. Delay aversion and the dual-pathway model

**Plain explanation.** Sonuga-Barke (2003) proposed two partly separate routes to ADHD symptoms. One is executive dysfunction (weak inhibitory control, linked to frontal-striatal circuits). The other is a motivational route in which delay is experienced as aversive, so the person acts to shorten or escape waiting: choosing the smaller sooner reward, switching tasks, or avoiding long tasks. These routes can occur separately or together, which helps explain why people with ADHD differ.

**Evidence.** The dual-pathway idea is well supported conceptually, and the existence of subgroups with and without executive deficits matches it (Willcutt et al., 2005). Experimental work on delay aversion and temporal discounting is mixed in size and in how well it carries into adulthood. The study by Broulidakis and colleagues linking delay aversion to default-mode connectivity is small (20 adolescents with ADHD) and should be treated as preliminary (see section 6).

**Evidence strength.** Moderate (model), emerging (specific mechanisms in adults).

**What this means for study design.**
- Make the payoff visible and near: show what will be learned in this chunk, how long it will take, and give a "done" mark quickly.
- Shorten waiting between effort and feedback: use self-check questions at the end of every chunk, not only at the end of the document.
- Do not hide the end. A visible finish line reduces the aversive "how long is this going to take?" feeling.

---

## 5. Reward, dopamine and motivation

**Plain explanation.** Interest and reward help everyone, but in ADHD the effect is stronger: performance and persistence depend more on how immediate, frequent and interesting the reward is. The popular line "ADHD is low dopamine" is a simplification; the research is about how reward signals are processed and anticipated.

**Evidence.**
- A review of reinforcement studies found that people with ADHD are more affected by reinforcement schedules: more sensitive to immediate and frequent reinforcement, and more impaired when reinforcement is delayed or absent (Luman et al., 2005).
- A meta-analysis of fMRI studies found reduced ventral striatal activation during reward anticipation in ADHD (Plichta & Scheres, 2014).
- A PET study of adults with ADHD reported lower availability of dopamine D2/D3 receptors and transporters in reward-pathway regions, correlated with motivation measures (Volkow et al., 2009).
- The dopamine transfer deficit theory proposes that reward-linked dopamine signals fail to shift to cues that predict reward, so delayed goals carry less drive (Tripp & Wickens, 2008). This is a theory with supporting but not conclusive evidence.
- A large mega-analysis found small differences in several subcortical brain volumes, mainly in children, with small effects and large overlap with controls (Hoogman et al., 2017). Brain scans cannot diagnose ADHD in an individual.

**Evidence strength.** Moderate for altered reward processing and reinforcement sensitivity; emerging for specific neurochemical stories; the brain-volume findings are small group effects, not diagnostics.

**What this means for study design.**
- Build in small, frequent, visible wins: checkboxes, "you now know three things", a progress bar.
- Make tasks interesting by adding challenge, curiosity hooks, personal relevance and light novelty, because interest changes performance in ADHD more than in non-ADHD readers.
- Do not promise "dopamine hacks". Say "this page uses quick rewards because reward timing matters for attention".
- Avoid gamification so heavy that it competes with the learning (points that distract from the content).

---

## 6. Default mode network, mind wandering and attention lapses

**Plain explanation.** The default mode network (DMN) is a set of brain regions active during self-directed thought. It normally quiets down when you focus on an external task. A leading hypothesis is that in ADHD the DMN fails to quiet down fully, so bursts of spontaneous internal activity intrude on the task, causing attention lapses (Sonuga-Barke & Castellanos, 2007). The mind-wandering hypothesis extends this: people with ADHD report more frequent, less controlled mind wandering, tied to altered DMN deactivation and weaker interplay with executive control networks (Bozhilova et al., 2018).

**Evidence.**
- A systematic review of mind wandering and ADHD found only nine qualifying studies (eight in adults) but a consistent link between ADHD and more spontaneous mind wandering, with greater functional impairment when it is present (Lanier et al., 2019).
- Increased reaction time variability is one of the most robust behavioral findings and fits the idea of momentary lapses: a meta-analysis of 319 studies found higher variability in children (g about 0.76) and adults (g about 0.46), and variability was reduced under stimulant treatment (Kofler et al., 2013).
- Connectivity findings are inconsistent between studies and often use small samples. Some work argues that mind wandering reflects a control problem and not only DMN intrusion, and other work links DMN differences to delay aversion rather than to mind wandering per se.

**Evidence strength.** Strong for increased moment-to-moment variability; moderate for increased self-reported mind wandering in adults; emerging for the specific DMN mechanism.

**What this means for study design.**
- Expect lapses and design for re-entry. Every chunk should be re-enterable: a one-line "where you are" header, a "if you lost the thread" recap, and anchors such as numbered sections.
- Use place-keeping tools: highlights of the key sentence, a "stop here" marker, a short chunk length.
- Active tasks (answer, sort, predict, draw) reduce idle reading time in which the mind can drift.
- Let the reader write down intruding thoughts: a "parking lot" line on the page.

---

## 7. Time perception ("time blindness")

**Plain explanation.** "Time blindness" is a popular phrase, widely used by Barkley and by clinicians, for difficulty feeling how much time has passed and how long tasks will take. It is not a formal diagnostic term. The research construct is timing and time perception.

**Evidence.**
- Meta-analyses show people with ADHD, on average, differ from controls on laboratory timing tasks: lower accuracy and more variability in estimating, reproducing and discriminating durations. One meta-analysis of 55 studies found deficits in discrimination of very short durations, more variable estimation of seconds, and signs of an accelerated internal clock, plus attention and motivation effects in reproduction tasks (Marx et al., 2022).
- A lifespan meta-analysis reported an average effect size near g = 0.69, moderated by age and working memory (Metcalfe et al., 2023). A child and adolescent meta-analysis also found less accurate and less precise time perception (Zheng et al., 2020). Earlier reviews of timing in ADHD reach a similar conclusion (Toplak et al., 2006; Noreika et al., 2013).
- For adults specifically, a decade review found the number of studies is small and results are mixed for time estimation and reproduction (Mette, 2023).
- What the evidence does not establish: that people with ADHD cannot tell time, that timing deficits explain all procrastination, or that any specific tool (visual timers, for example) has been shown in trials to fix it. Visual timers and external clocks are logical supports with practice-based support.

**Evidence strength.** Strong that group-level timing differences exist in the lab; emerging for adult everyday time management; practice wisdom for time tools.

**What this means for study design.**
- Replace "feeling" of time with visible time: every chunk shows an estimated reading time and a total.
- Use short, fixed blocks (for example 10 to 25 minutes) with a visible stop, and an "if it took longer, that is fine, here is how to adjust" note.
- Encourage comparing estimate to actual ("I guessed 15 minutes, it took 25") to calibrate over time. This is practice wisdom, so label it as optional.
- Lean toward over-estimating time, not under-estimating.

---

## 8. Hyperfocus: what the evidence says

**Plain explanation.** Hyperfocus is the experience of intense, absorbed concentration, often on an interesting task, with loss of awareness of time and surroundings. Many adults with ADHD describe it, which seems to contradict "attention deficit". The standard explanation is that ADHD is more about regulating attention than a shortage of it.

**Evidence.**
- Adults with ADHD in survey studies report hyperfocus more often than adults without ADHD, and across everyday activities such as screens, hobbies and work (Hupfeld et al., 2019).
- A review concludes that hyperfocus is poorly defined, rarely measured objectively, not a DSM criterion, and has not been shown to be specific to ADHD (Ashinoff & Abu-Akel, 2021). Evidence on its causes, costs and benefits is limited.
- The claim that hyperfocus can be "scheduled" or "harnessed" for studying lacks trial evidence.

**Evidence strength.** Emerging (self-report, few studies).

**What this means for study design.**
- Do not treat hyperfocus as a strategy. Treat it as a reported experience that sometimes helps and sometimes causes missed meals, missed deadlines or neglected tasks.
- If a reader reports being deeply absorbed, offer an external stop cue (alarm, planned break, "save your place" note), not "stop when you feel done".
- Interest-led entry points ("start with the part that fascinates you") are practice wisdom and fit the motivation research in section 5.

---

## 9. Emotional dysregulation

**Plain explanation.** Many people with ADHD report quick, strong emotional reactions: irritability, frustration with tasks, discouragement after setbacks, difficulty calming down. Emotional dysregulation is not in the DSM-5-TR symptom lists but is increasingly viewed as common and impairing, and Barkley treats emotion regulation as part of the core self-regulation problem.

**Evidence.**
- A major review concludes that emotional dysregulation is common in ADHD and linked to impairment, with overlapping but distinguishable brain-circuit findings from other emotional disorders (Shaw et al., 2014). Prevalence estimates vary a great deal across studies.
- In students, emotional regulation, academic self-efficacy and academic regulation predicted college success among students with ADHD and learning disorders in a 21-study review (Stevens et al., 2021). Depressive symptoms and executive functioning predicted four-year outcomes in a large cohort (DuPaul et al., 2021).

**Evidence strength.** Moderate.

**What this means for study design.**
- Use a calm, non-judgmental tone. No "just focus", no streak-shaming.
- Include a built-in repair move for a bad session: "If you stalled, do this one 2-minute thing, then pick any chunk".
- Normalize getting stuck and frame stalls as information (too big? too boring? too tired?).
- Offer a brief "reset" step (breathe, stand, drink water) between chunks. Evidence is mostly practice wisdom.

---

## 10. Interest, motivation and the "interest-based nervous system" idea

**Plain explanation.** A common description is that people with ADHD run on interest, challenge, novelty and urgency, not on importance. This phrase ("interest-based nervous system") is popular but is not a scientific model.

**Evidence.** The scientific grounding is the reinforcement and reward work in section 5 and the delay-aversion work in section 4. Self-reported motivation to study in year one predicted year-two GPA in a two-year study of 456 college students from 10 universities (Franklin et al., 2018), so motivation is a practical target.

**Evidence strength.** Moderate (reinforcement sensitivity); practice wisdom (the popular interest-based label).

**What this means for study design.**
- Start with a hook that links the topic to the reader's own goal (a question they care about, a real example, a thesis connection).
- Vary format (read, predict, sort, explain aloud) every few minutes.
- Add light, honest urgency (a short timer, a deadline for this block), not manufactured panic.

---

## 11. ADHD in university students

**Prevalence.** Estimates of ADHD among college students come from a few percent in diagnosed samples to higher figures for self-reported symptoms. Because definitions differ, treat any single figure with caution (DuPaul et al., 2009; Weyandt & DuPaul, 2006). Postgraduate numbers (MA, PhD) are much less studied than undergraduate numbers.

**Academic outcomes.**
- Broad meta-analytic evidence shows achievement problems with ADHD (about d = 0.71 across ages) and a modest but meaningful prediction of first-year grades in college (Frazier et al., 2007). A 2026 meta-analysis of 106 studies found a small-to-moderate negative link between inattention ratings and achievement (r about -.25), stronger for inattention than for hyperactivity-impulsivity and stronger for complex tasks like comprehension and written expression (Gioia et al., 2026).
- A 2024 systematic review of 15 studies found ADHD symptoms, especially inattention, relate to lower college academic performance, and that executive function, medication use and study strategies influence outcomes (Pagespetit et al., 2024).
- A four-year study of 201 students with ADHD and 205 comparison students found lower GPAs (g about -0.46 to -0.63), less use of study skills strategies, and lower persistence over eight semesters (about 49 percent for unmedicated ADHD students versus about 59 percent for comparison students). Better executive functioning, fewer depressive symptoms, high school accommodations and college academic support predicted better outcomes (DuPaul et al., 2021).
- In 3,688 post-secondary students, inattention symptoms at entry predicted lower GPA and higher dropout (Henning et al., 2021).
- A first-year study found that typically available campus services were not independently related to GPA (Gormley et al., 2016), which suggests that generic support is not enough and targeted skills matter.
- A long-term review found worse achievement outcomes with untreated ADHD and the largest improvements with multimodal treatment (Arnold et al., 2020).

**Common difficulties reported or measured.** Starting and finishing tasks, sustaining reading, organizing materials, estimating time, maintaining routine, managing deadlines, emotional discouragement after setbacks, and low use of study strategies.

**Evidence strength.** Strong for lower average academic outcomes; moderate for predictors; the data are mostly undergraduate and many outcomes are self-reported.

**What this means for study design.**
- A reading-heavy graduate workflow (articles, chapters) is exactly where inattention costs most, particularly for complex comprehension tasks.
- Teach and scaffold study strategies explicitly, because strategy use is low and strategy training is a target (DuPaul et al., 2021; Stevens et al., 2021).
- Pair every study task with an executive-function support (plan, timer, checkpoint), not only a summary.

---

## 12. Evidence for learning strategies with ADHD learners

A frank point first: there is strong general evidence for several learning strategies, but very little ADHD-specific trial evidence for the strategies below. The skill should say so. The recommended position is "strong general science, applied with ADHD-aware scaffolding".

| Strategy | General evidence | ADHD-specific evidence | Net label |
|---|---|---|---|
| Retrieval practice (self-testing) | Strong: testing beats restudy, about half a standard deviation in meta-analysis (Rowland, 2014; Adesope et al., 2017); rated high utility (Dunlosky et al., 2013) | Not found as a controlled study in ADHD students (none located) | Strong (general), emerging (ADHD) |
| Spaced (distributed) practice | Strong: spacing improves retention (Cepeda et al., 2006); high utility (Dunlosky et al., 2013) | Not located | Strong (general) |
| Segmenting / limiting cognitive load | Strong theory and multimedia studies (Sweller, 1988; Mayer & Moreno, 2003) | Inferred from working memory data | Moderate |
| Novelty and interest | Interest improves engagement in general | Reinforcement sensitivity in ADHD (Luman et al., 2005) | Emerging / practice wisdom |
| Movement and exercise | Physical activity can aid cognition in general | Meta-analysis of RCTs in children finds benefits for attention and executive outcomes (Cerrillo-Urbina et al., 2015); adult student evidence is thinner | Moderate (children), emerging (adults) |
| External structure (plans, if-then rules, timers, checklists) | Implementation intentions have a medium-to-large effect on goal attainment (Gollwitzer & Sheeran, 2006) | If-then plans improved inhibition in children with ADHD (Gawrilow & Gollwitzer, 2008) | Moderate |
| Executive-function coaching | Little general evidence | Small pre-post studies in college students show gains in strategy use (Parker & Boutelle, 2009; Prevatt & Yelland, 2015) | Emerging |
| Working memory training | Weak transfer | No meaningful benefit for everyday ADHD outcomes (Rapport et al., 2013; Cortese et al., 2015) | Not recommended as a fix |

**What this means for study design.**
- Build retrieval and spacing into every output: a short self-quiz at the end of each chunk, and a "come back tomorrow" review prompt with a few questions.
- Use "if-then" plans as the default way to launch a session ("If it is 4 pm and I am at my desk, then I open chunk 1").
- Use movement as a break option, not a requirement, and word it as optional.
- Never claim ADHD-specific proof for retrieval or spacing; say "strong for learners in general, and a good fit for the executive-function profile".

---

## 13. Treatment landscape (general terms only)

This section explains the landscape so the skill can respond sensibly when a reader mentions treatment. It does not recommend or adjust treatment. Questions about treatment go to a clinician.

**Medication.** Two broad classes are used: stimulants (methylphenidate-based and amphetamine-based) and non-stimulants. A network meta-analysis found that medications reduce core symptoms in the short term across ages, with differences between drugs in efficacy and tolerability; adults showed benefits in clinician-rated symptoms, and tolerability varied (Cortese et al., 2018). Medication changes how well a person can use strategies; it does not teach strategies. Stimulant treatment reduced reaction time variability in a meta-analysis (Kofler et al., 2013).

**Psychological treatment.** In adults with persistent symptoms despite medication, cognitive behavioral therapy added to medication improved symptoms compared with relaxation and educational support in a randomized trial (Safren et al., 2010). A meta-analysis of cognitive-behavioral treatments for adult ADHD reports benefits, with the caveat that effects look smaller when raters are blind to treatment (Knouse et al., 2017).

**Non-pharmacological approaches in general.** A meta-analysis of randomized trials found limited evidence for effects on core ADHD symptoms when ratings come from blinded assessors, for dietary and psychological approaches in children (Sonuga-Barke et al., 2013). Cognitive training improves trained neuropsychological tasks but not blinded ADHD symptoms (Cortese et al., 2015).

**Coaching.** Small studies in college students suggest coaching can improve self-reported study strategies and self-regulation (Parker & Boutelle, 2009; Prevatt & Yelland, 2015). Designs are mostly uncontrolled, so evidence is emerging.

**Multimodal care.** Long-term academic outcomes improved most with combined approaches (Arnold et al., 2020).

**Evidence strength.** Strong for short-term medication effects on core symptoms; moderate for CBT in adults; emerging for coaching.

**What this means for study design.**
- A study skill is not a substitute for assessment. If a reader asks "do I have ADHD?" or "should I take medication?", the right response is to suggest a qualified clinician, not to answer.
- Do not give any dosing, timing or medication-adjustment advice.
- Be neutral on treatment choices. Support is useful whether or not a person is medicated.
- Treat the skill's strategies as complements to professional care.

---

## 14. Cross-cutting summary table

| Topic | Strength | Core design response |
|---|---|---|
| Diagnosis and presentation | Strong | Support the nine inattentive items; no diagnosis claims |
| Executive function | Strong (group), moderate (full account) | Page holds plan, sequence, place |
| Working memory | Strong (deficit), strong (no training transfer) | Answer first, small chunks, running recap |
| Delay aversion | Moderate | Visible payoff, finish line, quick feedback |
| Reward / interest | Moderate | Frequent small wins, relevance hooks |
| DMN / lapses | Strong (variability), emerging (mechanism) | Re-entry anchors, active tasks, parking lot |
| Time perception | Strong (lab), emerging (daily life) | Visible time, fixed short blocks, calibration |
| Hyperfocus | Emerging | External stop cues, not a strategy |
| Emotion | Moderate | Calm tone, repair moves, normalize stalls |
| University outcomes | Strong (average gap) | Teach strategy use, add EF scaffolding |
| Learning strategies | Strong (general), emerging (ADHD) | Retrieval, spacing, if-then plans |
| Treatment | Strong (meds, short term), moderate (CBT) | Complement care, no medical advice |

## 15. Limits of this evidence base (read before over-claiming)

- Most mechanistic and treatment trials involve children and adolescents; adult and postgraduate data are sparser.
- Many university-student studies rely on self-reported symptoms and self-reported grades.
- Group-level effects do not predict an individual. Design for variety: offer options, not prescriptions.
- Popular terms (time blindness, interest-based nervous system, dopamine hacking, hyperfocus superpower) outrun the evidence. Use them only as lay shorthand, and label them as such.
- Brain-imaging differences are small and overlap with controls. No imaging finding diagnoses ADHD.
- Evidence for ADHD-specific retrieval practice, spacing, novelty and movement studies in adult students was not located during this review. Absence from this review is not proof of absence. Recheck periodically.
