---
description: "Run The Improver (Opus, high effort) to examine the whole Easy Paper plugin and its outputs, fix bugs and drift, and raise quality; logs changes in IMPROVEMENTS.md."
argument-hint: "[focus area, optional]"
---

Spawn the `ep-improver` agent (model: opus; reasoning effort: high) on the Easy Paper plugin. Focus: $ARGUMENTS (if empty: everything). It must test before and after its changes, keep the user's design decisions intact, and log every change in IMPROVEMENTS.md. Show the user its summary and the recommendations it did not implement.
