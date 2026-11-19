# Build and review

## Data contract

Copy the relevant file under `examples/` and update its content. Use UTF-8 JSON and plain text. Read each source output before adapting it, even when supplying its PDF as a handout.

| Key | Value |
|---|---|
| `title`, `kicker`, `subtitle`, `citation`, `focus` | Paper title for the app, short topic label, study goal, bibliographic line and main takeaway |
| `preview` | Two or more preview questions |
| `map` | At least three nodes, each with `label` and `detail` |
| `modes` | Exactly `deep-dive`, `critique`, `review-guide`, `vocab-treasure`. Each has `intro` and `sections`. |
| `sections[]` | `title` as a Hunt Question, `summary` as the answer, `points` as a string array, `anchor` as a source locator and optional `memory`. Vocabulary sections may be empty when the entries provide sufficient guidance. |
| `vocabulary[]` | `term`, `meaning`, `alternatives` array, original `example` sentence and source `anchor` |
| `quiz[]` | At least three distinct questions with `question`, `options` array, zero-based integer `answer`, `explanation` and `anchor` |
| `notes` | Optional presenter cue with the suggested opening or speaking plan |
| `film` | Optional bundled example film name. Remove it when adapting an example for a different paper. Use `--film` to attach a new one. |
| `qc` | `status` must be `passed`. Record the review evidence and scope in `source`. |

The four PDFs are handouts. The interactive version gives each mode a deliberate route and preserves the highest-value points, distinctions and locators. Vocab Treasure can carry the full shortlist. Questions test interpretation and recall, with plausible distractors and explanations. Retain the source's page scheme, for example printed pages for journals and PDF pages for an unnumbered preprint.

## Build

From this skill directory:

```powershell
python scripts/build.py --theme confessor --data examples/confessor.json --output Confessor.html
```

Append repeated `--pdf "mode=path"` arguments to include the approved Deep Dive, Critique, Review Guide and Vocab Treasure. When embedded, each original PDF can be downloaded from its matching study mode. The shipped templates keep the full interactive content in a compact file. The delivered presentation files also carry the four original PDFs.

Theme shells place `{{HERO}}`, `{{NAV}}`, `{{PANELS}}`, `{{INTRO}}` and `{{FOOTER}}` once each. Embed files from the theme's own `assets/` with `{{ASSET:filename}}`. The theme CSS controls layout and type. The runtime handles navigation, hash links, presentation controls, retrieval feedback and the intro. Theme scripts can receive `mordsith:section` (with `detail.id`) and `mordsith:intro` on `document`.

## Review

- Open the completed HTML directly from disk with networking disabled. Test every mode, reload a section link, open an embedded PDF, answer and reset the quiz, and test the signature intro and its close control.
- Check keyboard order and visible focus. In Present mode use the previous and next buttons or Left and Right. Escape exits the presentation. Quiz radios keep their native arrow-key behavior.
- Read the hero and representative content on a phone-sized viewport and a projected desktop view. Check long titles, wrapping, scroll position, contrast and uncovered controls.
- Enable the operating system's reduced-motion setting and confirm that movement is subdued. Check that Seeker's soundtrack starts on command, pauses when the tab is hidden, and stays exclusive to Seeker.
- Cross-check the app's quiz keys, claims, locators and wording against the approved modes and paper. The builder validates structure and the QC flag. The underlying scholarly review is a human or agent task.
- Check text rectangles and grid children at mobile, tablet and desktop widths in every study mode. Test the film, captions, transcript, sound opt-in and pause behavior when opening another player or leaving the tab. See [paper summary films](paper-films.md).
