# Design sources and media

The three shells, their styles, and their scripts are the small, local template library. They include the actual navigation, visuals, typography, interactions and page structure used in the delivered apps.

- **Agiel and Confessor:** The workspace copy of HTML God, particularly `sensei-presentations`, `sensei-single-file`, `sensei-motion-ui` and `sensei-ui-components`, guided the presentation, offline packaging, and motion decisions. Preserve responsive reading layouts, support keyboard traversal, and honor reduced motion. Theme-specific notes and notices accompany any assets used.
- **Seeker:** The user-supplied `Kitchen.txt` informed the interactive components. [dqnamo’s Kitchen](https://www.dqnamo.com/kitchen), [Motion](https://github.com/motiondivision/motion), and [MotionSites Web Builder](https://github.com/Motionsites-AI/claude-skill) were reviewed for component behavior and choreography. See the Seeker theme's provenance for the implementation and licensing details. MotionSites restricts redistribution of its example prompts and media.
- **Shared signature intro:** The five-second render supplied in the workspace was transcoded to a 720p H.264/AAC MP4 for offline embedding. The workspace includes its original render and signature image. The original HyperFrames project is absent from the delivered source files. [HyperFrames](https://github.com/heygen-com/hyperframes)
- **Owner-supplied media:** The owner approved the signature intro and Seeker recording for the public Easy Paper release. Third-party reuse of these assets requires the applicable permissions. The [public study handouts](https://github.com/teachersam7734-web/easy-paper/tree/main/examples/handouts) include the four approved PDFs for each paper.

No theme makes a network request in use. Embedded resources move with the single HTML file.
