---
name: easy-paper-mordsith
description: Build a single-file offline Mord’Sith interactive presentation from an Easy Paper Deep Dive, Critique, Review Guide, and Vocab Treasure that passed ADHD QC. Use when asked to combine Easy Paper outputs into an interactive study app or to build with Agiel, Confessor, or Seeker.
---

# Mord’Sith

Turn four reviewed Easy Paper outputs for one paper into one offline HTML study application. Keep the original PDFs available inside the application whenever supplied. Use the three bundled examples as reference implementations. For a 1–2 minute paper-specific film, follow [the paper film guide](references/paper-films.md).

| Theme | Design | Example |
|---|---|---|
| Agiel | Reactive crimson field console with abstract blood cells and optical scanning | Ibrahim, AI-assisted plagiarism in L2 |
| Confessor | Lunar study folio with a shaded moon, selectable illumination and parallax stars | Johnson et al., mixed methods research |
| Seeker | 3D sword-and-arrow archive with stage navigation and optional Focus Tape | Lund et al., AI in research and publishing |

## Workflow

1. Identify the paper and the four matching outputs. Prefer reviewed specs or Markdown when available. Confirm that the four outputs passed the ADHD Student audit and that their source findings, interpretations and references are distinguishable. In the full plugin, use the neighboring `adhd-student/SKILL.md` and the four mode skills to complete missing stages. With only this skill, request the missing reviewed material or a working Easy Paper installation.
2. Use the requested theme. If omitted, use Confessor for a quiet reading and study layout. Use the theme's existing `shell.html`, `theme.css` and `theme.js`. Read [the design quality guide](references/design-quality.md) before adapting a theme. Give the paper title and main study action priority. Use the paper’s subject to choose or adapt each visual.
3. Read [the data contract](references/build-and-review.md). Populate the content JSON from the reviewed outputs. Preserve caveats, use concise Hunt Questions, include Memory Links where appropriate and include source locators for claims and retrieval answers. Keep original quotes and generated usage examples distinct.
4. Run the bundled builder with the data and all available original handouts. The build needs Python 3.9+ and the skill files. The resulting app needs only a browser.
5. Review the generated file using the checks in [the build and review guide](references/build-and-review.md). Check the hero, study panel, navigation and active states at desktop and narrow mobile widths with keyboard focus and reduced motion. Keep the question and the flipped answer inside the card padding. The reverse side shows the correct answer, explanation and source. Run the frame audit for any film you produce. Deliver the HTML and identify the theme. Keep music and Kitchen-derived components exclusive to Seeker.

Reuse the supplied five-second signature intro. It opens by user action and can be closed immediately. Preserve the reduced-motion behavior and the keyboard presentation controls.

For theme changes, consult the [cinematic UI research](references/cinematic-ui.md), [design sources](references/design-sources.md), and the [copy-ready CSS library](references/css-library.md). Use distinct type pairings from the available local fonts. The full-page atmosphere and card lighting live in `runtime/atmosphere.*`. Keep the lighting behind content and avoid moving cards while a person reads. The page and hero share their motion control. Pause decorative motion when hidden and honor reduced motion. Keep interaction sounds opt-in.
