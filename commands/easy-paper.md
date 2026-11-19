---
description: "Turn a paper into Easy Paper study PDFs. Asks which mode (Deep Dive, Critique, Review Guide, Vocab Treasure, or all four) if not given."
argument-hint: "[path-to-paper] [deep-dive|critique|review-guide|vocab-treasure|all]"
---

Run Easy Paper on: $ARGUMENTS

1. Load the `easy-paper-core` skill and follow its shared workflow.
2. Find the paper (a path in the arguments, an attached file, or ask). If the user pasted the master prompt (`skills/easy-paper-core/references/master-prompt.md`), follow its choices. Otherwise, if no mode was given, ask once: Deep Dive (present it), Critique (discuss or defend it aloud), Review Guide (exam in about 2 hours), Vocab Treasure (academic language), or All four; and whether to run an ADHD QC.
3. Load the chosen mode skill(s) and run their pipelines with the plugin agents (`ep-*`). For "all", build the dossier once and share it across the three study guides. Mine Vocab Treasure directly from the source sentences. Run the ADHD QC (`adhd-student`) before delivery if chosen.
4. If an interactive application is requested, prepare and complete ADHD QC on all four modes. Clarify any explicit ADHD QC opt-out, then follow the Mord’Sith command with the selected theme.
5. Deliver the requested PDFs with one line of context and include the HTML when requested. For a requested study-buddy session, follow `skills/adhd-student/SKILL.md`.
