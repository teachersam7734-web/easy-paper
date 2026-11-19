---
description: "Run the Easy Paper Inspector on an existing spec/PDF (or on the plugin itself) and report a scored fix list."
argument-hint: "[workspace-or-spec-path | plugin]"
---

Target: $ARGUMENTS

If the target is `plugin`, spawn `ep-inspector` to audit the plugin: every SKILL.md and agent references files that exist; scripts run (`render.py` on each `skills/*/assets/skeleton.spec.json` with `--html-only`); the validator rules match the layout templates; no em dashes in the references. Otherwise spawn `ep-inspector` on the spec, its PDF and the workspace's `paper.txt`, following `skills/easy-paper-core/references/qc-rubric.md`. Show the score, verdict and fix list.
