# Seeker source notes

Seeker translates the cassette, animated receipt and dynamic button supplied in the project’s `Kitchen.txt` into standalone browser controls. The supplied audio wrapper references a CassettePlayer implementation absent from that file, so Seeker implements its transport and reel visuals locally. Kitchen: https://www.dqnamo.com/kitchen

The original browser animations adopt the timing and purposeful transitions described by Motion and MotionSites. Motion uses the MIT license. MotionSites releases its skill instructions, references and scripts under MIT and reserves redistribution of its example and media collection. The theme uses independently written styles and scripts with no files copied from those repositories.

- Motion license: https://github.com/motiondivision/motion/blob/main/LICENSE.md
- MotionSites license: https://github.com/Motionsites-AI/claude-skill/blob/main/LICENSE

Music is the project-supplied `Music.mp3`, encoded as 96 kbps MP3 for offline use in Seeker. The project supplied it for private use. No public redistribution rights are asserted. Locally supplied typefaces include Bruno Ace, Sora, Chakra Petch, Space Grotesk, Inter and IBM Plex Mono from the project’s `fonts` folder. See the SIL Open Font License notices in `assets`.

## Publication route

The original blade and five arrow-shaped markers are projected from meshes in three-dimensional space. The selected marker follows a stage in the paper’s publishing workflow. Its explanation is in the page markup and stays readable while the scene moves. The mesh and lighting code ship inline.

- Three.js provides reference material for directional lights and perspective camera framing. The demo and its implementation were reviewed under the MIT license. [Three.js examples](https://threejs.org/examples/#webgl_materials_physical_clearcoat) · [Source license](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
- Drei demonstrates floating a staged object while keeping its framing stable. Seeker uses its own bounded motion and camera response. [Drei Float](https://drei.docs.pmnd.rs/staging/float) · [MIT license](https://github.com/pmndrs/drei/blob/master/LICENSE)
- Google’s model-viewer illustrates explicit camera interaction and restraint around user gestures. The desktop pointer response here is intentionally small and the touch view preserves page scrolling. [Model-viewer examples](https://modelviewer.dev/examples/staging-and-camera-control.html) · [Apache 2.0 license](https://github.com/google/model-viewer/blob/master/LICENSE)
- The workspace’s HTML God `sensei-3d` and `sensei-single-file` guidance informed offscreen and hidden-tab suspension, the pause control, the reduced-motion still, responsive rendering and the offline bundle.
