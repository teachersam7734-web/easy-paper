---
description: "ADHD QC: the ADHD Auditor and the Distracted Reader check an Easy Paper output (or any study material) for ADHD-friendliness, then adjust it and re-render."
argument-hint: "[spec-or-pdf-or-workspace] [adjust|report]"
---

Target: $ARGUMENTS

Load the `adhd-student` skill and run job 3 (ADHD QC): spawn `ep-adhd-auditor` and `ep-distracted-reader` in parallel on the target, merge their reports with `skills/adhd-student/references/adhd-qc-rubric.md`, and show the score, verdict and fix list. Unless the user said `report`, have the Auditor apply the fixes, re-render with render.py (it must print OK) and re-score, at most 2 loops.
