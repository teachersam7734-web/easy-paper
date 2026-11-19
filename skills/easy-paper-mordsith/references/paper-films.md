# Paper summary films

Each example has an original 1–2 minute film. Agiel follows an evidence flag through an investigation. Confessor builds a definition from intersecting research strands. Seeker follows a manuscript through five publishing stages. Each has its own cuts, lighting and stereo effects, English narration, timed captions, a transcript and [original cover art](film-cover-prompts.md).

## Attach a film

Keep the film specific to the new paper. In a reused example JSON, remove the example’s `film` key. Pass `--film path/to/film-folder` to the builder. The folder holds `summary.mp4` in H.264/AAC, a `cover.jpg` or `poster.jpg`, and a `film.json` with `title`, `source`, `duration` in seconds, and chronological `cues`. Each cue contains a plain-text `text`, `start`, and `end` in seconds. Keep caption durations tied to narration. The browser receives embedded video, cover and cues. The separate WebVTT in each example can accompany the MP4.

Give the film an opening question, a progression based on the study, and a clear final takeaway. Distinguish author conclusions, demonstrated findings and a suggested application. Have a reviewer check all quantitative claims and page locators against the paper. Use source cards, scales, renders, or images whose visual changes explain something about the paper. Keep the lower part of the frame clear where captions can appear.

## Rebuild the three bundled films

The editable storyboards, font assets and Canvas compositions are under `films/source/`. The bundled films use ElevenLabs’ Emilia voice. Generate a single take per film from `stories.json`, with a paragraph for each scene. Save the three MP3 takes as `agiel.mp3`, `confessor.mp3` and `seeker.mp3`. `align_takes.py` uses Whisper to align the authored captions and edits to the continuous take. `render.cjs` captures each 1280 × 720 frame through Chromium and encodes it in FFmpeg.

```powershell
python films/source/align_takes.py path/to/render-work path/to/takes --whisper path/to/whisper-cli --model path/to/english-model.bin
node films/source/render.cjs path/to/render-work
```

Install Playwright, a Chromium browser, and FFmpeg for the source workflow. `EASY_PAPER_PLAYWRIGHT` can point to an existing Playwright package and `EASY_PAPER_CHROMIUM` to an installed browser. Append `--audit` to check each frame's text and caption-safe area without exporting. `prepare.py` supports separate cue recordings and Edge TTS for new authoring. The renderer ducks the original stereo sound effects beneath speech. Seeker's Focus Tape pauses during film playback.

Use Whisper to compare the rendered narration with the script. Review flagged scholarly names and numbers by ear before replacing any caption text. For cutaways, record the creator, source, and license. yt-dlp can fetch the public media available under that license. Clip and grade the shot for the composition and carry the original attribution in the transcript. The included excerpts remain independent of the Seeker soundtrack.

| Film | Cutaway | How the edit uses it |
|---|---|---|
| Agiel | Phillips Vinegar's [A Person Using a Copier](https://www.pexels.com/video/a-person-using-a-copier-6390051/) | Cropped, warm-monochrome document footage beneath the opening evidence scan |
| Confessor | Dan Cristian Pădureț's [Colored Liquids Mixing in Slow Motion](https://www.pexels.com/video/colored-liquids-mixing-in-slow-motion-15432097/) | A desaturated pigment-flow plate under the intersecting methods diagram |
| Seeker | Kuba Grzybek's [Close up of an Industrial Printing Machine Working](https://www.pexels.com/video/close-up-of-an-industrial-printing-machine-working-11730362/) | A cropped press shot inside the opening manuscript transfer frame |

The cutaways are used under the [Pexels License](https://www.pexels.com/license/) as edited material in the three compositions.

| Film | Additional cutaways |
|---|---|
| Agiel | [Fingers typing by Coverr](https://www.pexels.com/video/close-up-video-of-fingers-typing-853774/), [document revision by cottonbro studio](https://www.pexels.com/video/a-person-revising-a-document-7597871/), [paperwork by Kindel Media](https://www.pexels.com/video/person-holding-a-paper-7687789/) |
| Confessor | [Chart notes by Pavel Danilyuk](https://www.pexels.com/video/person-taking-notes-from-a-chart-8344130/), [discussion over a document by RDNE Stock project](https://www.pexels.com/video/close-up-view-of-a-man-pointing-on-a-paper-while-talking-to-someone-7413793/), [handwriting by Kindel Media](https://www.pexels.com/video/a-person-writing-on-a-paper-7981920/) |
| Seeker | [Research desk by Edmond Dantès](https://www.pexels.com/video/person-using-laptop-8033572/), [page turn by Pranjall Kumar](https://www.pexels.com/video/a-person-flipping-the-next-page-of-a-book-6185321/), [paper production by Everett Bumstead](https://www.pexels.com/video/industrial-printing-press-producing-paper-sheets-29975898/) |

| Film | New cutaways |
|---|---|
| Agiel | [Marked documents by Ron Lach](https://www.pexels.com/video/a-person-scanning-the-softbound-documents-8085797/), [Circuit-board macro by Video Kickstarter](https://www.pexels.com/video/a-close-up-video-of-a-circuit-board-components-2376982/), [Typing beside a draft by SHVETS production](https://www.pexels.com/video/a-man-typing-on-the-laptop-7546421/), [Sorting documents by Kaboompics.com](https://www.pexels.com/video/people-organizing-paperwork-7710497/) |
| Confessor | [Interview notes by George Milton](https://www.pexels.com/video/a-person-taking-notes-during-and-interview-6948565/), [Reviewing charts by Gustavo Fring](https://www.pexels.com/video/close-up-of-documents-6285657/), [Blue ink diffusion by cottonbro studio](https://www.pexels.com/video/close-up-shot-of-blue-ink-diffusion-in-water-9668944/), [Interweaving pigments by StefWithAnF](https://www.pexels.com/video/mix-of-colorful-liquids-in-motion-10866367/) |
| Seeker | [Archive shelves by MART PRODUCTION](https://www.pexels.com/video/a-man-looking-at-the-books-on-a-shelves-8870177/), [Working through sources by Ron Lach](https://www.pexels.com/video/a-man-looking-at-documents-and-typing-on-a-laptop-8036696/), [Retrieving a book by Ron Lach](https://www.pexels.com/video/a-woman-getting-a-book-from-a-book-shelf-8086641/), [Paper through the press by Everett Bumstead](https://www.pexels.com/video/high-speed-paper-printing-press-in-action-29975893/) |

The deterministic timing draws on [Remotion's frame model](https://www.remotion.dev/docs/use-current-frame) and [HyperFrames](https://github.com/heygen-com/hyperframes). The visual research drew on the evidence motif in [Halt and Catch Fire](https://www.artofthetitle.com/title/halt-and-catch-fire/), the persistent geometry in [3Blue1Brown's transformations lesson](https://www.3blue1brown.com/lessons/linear-transformations/), and the moving object in [Catch Me If You Can](https://www.artofthetitle.com/title/catch-me-if-you-can/). Agiel's hologram scans the layers of a document. Confessor's two projected strands converge. Seeker sends a manuscript through five gates. Caption conventions follow [W3C media accessibility guidance](https://www.w3.org/WAI/media/av/captions/).
