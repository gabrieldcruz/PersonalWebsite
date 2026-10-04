# Menu reference

This personal portfolio adapts the visual direction of [deltea/p3r-pause-menu](https://github.com/deltea/p3r-pause-menu), reference commit `3adc18a2cdd6b27cc03155651768b61df795f2a3`.

The menu layout and selection artwork are implemented in this project with responsive SVG and CSS. Gabriel Cruz's profile, project files, and navigation remain personal portfolio content.

Reference assets used here:

- `static/p3r-background.mp4`: the reference repository's edited Persona 3 Reload background, converted to H.264 with fast-start loading for browser compatibility.
- `static/fonts/reload-menu.woff`: a Latin subset of the reference repository's Rodin Pro UB font. The font's original metadata is retained.

The reference creator documents the asset sources and design in [their design writeup](https://www.deltea.space/blog/p3r-pause-menu). Persona 3 Reload artwork is associated with ATLUS; fonts retain their original ownership.

## Background music

[Color Your Night (Instrumental), uploaded by CG Instrumentals](https://www.youtube.com/watch?v=NQ8mg_lSfxQ) is played using the YouTube iframe API. It starts after a visitor interacts, fades to 8% player volume, and has a separate saved music toggle. Playback pauses while the browser tab is hidden.
