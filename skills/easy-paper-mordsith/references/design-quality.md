# Visual design review

Mord’Sith is an offline study presentation built around the paper, evidence, and retrieval practice. Each theme needs a recognizable visual point of view, a clear way into the four study modes, and a comfortable reading layout. Review the rendered example and a long-title fixture before changing a theme.

## GitHub references

| Repository | License | How to apply it |
|---|---|---|
| [Impeccable](https://github.com/pbakaus/impeccable) | [Apache-2.0](https://github.com/pbakaus/impeccable/blob/main/LICENSE) | Critique the rendered scenes before polishing. Eliminate nested cards, generic icon tiles, low-contrast gray labels, and redundant chrome. Preserve the existing design intent and study behavior during refinement. [Design skill](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md) |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | [MIT](https://github.com/Leonxlnx/taste-skill/blob/main/LICENSE) | Use plain copy, aligned content edges, a coherent visual system, and an actual browser review. Give the cover a clear focal point and make the next reading action easy to find. [Workflow](https://github.com/Leonxlnx/taste-skill/blob/main/README.md) |
| [Anthropic Skills](https://github.com/anthropics/skills) | [Apache-2.0 for Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt) | Choose typography, color, scale, and composition for each theme's purpose. Group motion into a deliberate moment and use interactive motion to explain state changes. [Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/LICENSE) | Apply a design system and preflight across scenes. Check contrast, keyboard focus, mobile fit, and reduced motion on the actual theme surfaces and controls. [Repository guide and checklist](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/README.md) |
| [Emil Kowalski’s Skills](https://github.com/emilkowalski/skills) | [MIT](https://github.com/emilkowalski/skills/blob/main/LICENSE) | Keep repeated actions immediate. Where motion communicates an opening or reveal, use short ease-out transitions with transform and opacity when practical. [Interaction notes](https://github.com/emilkowalski/skills/blob/main/ui-cheatsheet.md), [performance notes](https://github.com/emilkowalski/skills/blob/main/performance-cheatsheet.md) |

These references inform original theme work. Keep any imported material tied to its provenance and applicable license. Use original compositions and retain the source and permission notes for embedded fonts, media, and handouts.

## Apply by theme

### Agiel · evidence field console

Use compressed display type for the paper title and a plain reading face for explanations. Give the evidence scanner a clear relationship to the title and evidence text. Put useful state and paper metadata on a single aligned rail. Use crimson for active controls, meaningful scanner state, and select headings. Let panels share an edge or a rule where a row of framed boxes would make every item equally prominent. On narrow screens, put the title and study navigation ahead of scanner detail and ensure that the scanner has a legible static state.

### Confessor · editorial study folio

Use a stable left reading edge, a legible serif-led hierarchy, a bounded prose measure, and a fine rule for separating sections. Treat venue, year, citations, and page numbers as marginal or bibliographic information. Give the paper title space and keep its source metadata legible. Pair the study lens with its caption and destination so that exploration leads into the relevant study mode. Use pairing, spacing, and alignment to group passages before reaching for cards. Give review questions, quotations, and glossary text recognizable forms suited to how students read them.

### Seeker · kinetic study interface

Lead with the paper and a visible way into the study material. Use a consistent technical type system and clear reading blocks. Let Focus Tape and the recall receipt carry the device character. Keep playback optional, its state clear, and all essential content accessible with playback stopped. Save the strongest motion for an intentional action or reveal. Keep keyboard slide navigation immediate and make the receipt readable on narrow screens.

## Before delivery

- Open each bundled example in a browser at desktop and mobile sizes. Inspect the cover and all four study modes. Repeat with a long paper title and a dense content slide.
- Confirm a clear first reading action, a visible current mode and slide position, and a consistent reading order. Keep labels that convey a task, state, source, or location. Remove repeated labels and decorations that compete with the paper.
- Check wrapping, reading measure, contrast, and content overflow. Check keyboard focus in order and verify every control with keyboard and touch where applicable. Use at least 4.5:1 contrast for normal text, including secondary text.
- Verify reduced motion, offline use, and access to original handouts. Check that the signature intro closes promptly and that Seeker sound starts only on request. Ensure status and navigation remain understandable through text or shape as well as color.
- Build the distributable HTML from the checked theme sources and verify the generated file. Record any deliberate exception with its purpose and the viewport or interaction checked.
