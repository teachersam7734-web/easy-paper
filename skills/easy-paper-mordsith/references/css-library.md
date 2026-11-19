# CSS library

The [copy-ready CSS kit](../runtime/css-kit.css) has the reusable patterns used across the applications. Each theme's `theme.css` adds its typography, layout, art and motion. The builder embeds the CSS in the HTML.

| Asset | Where it is used | Design source |
|---|---|---|
| Fluid map grid | All three study maps | Original Grid pattern informed by [CSS Layout](https://github.com/phuocng/csslayout). |
| Selected radio cards and correct-answer marker | All three quizzes | Native form approach from [Pico CSS](https://github.com/picocss/pico) and interaction-state guidance from [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale). |
| Open disclosure and keyboard focus | All three study interfaces | Original CSS following local HTML God's native disclosure and forced-colors guidance. |
| Two easing tokens | Control transitions in all three | Selected values from [Open Props](https://raw.githubusercontent.com/argyleink/open-props/main/src/props.easing.css), with the [MIT notice](../assets/Open-Props-LICENSE.txt) embedded in each app. |
| Corner-bracket source locator | Agiel | Original CSS using gradients as geometry, a technique catalogued by [CSS Pattern](https://css-pattern.com/). |
| Border-aligned memory note | Confessor | Original CSS following the HTML God editorial direction. |
| Active rail marker | Seeker | Original CSS state for the dynamic-button pattern. [Uiverse gallery](https://github.com/uiverse-io/galaxy) |

The kit combines selected Open Props values with original CSS implementations. Its focus, layout, and motion choices follow the local HTML God guidance reviewed for the project. The kit works without a CSS framework or external requests.
