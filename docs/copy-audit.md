# Copy Audit: sound_viz

Site: https://stannrodriguez.github.io/sound_viz/

## Issues Found and Changes Made

- **index.html**: Replaced default `Vite + React` title and added description, Open Graph, and Twitter meta tags so browser tabs and shared links describe the app.
- **README.md**: Replaced the Vite starter template with an accurate overview of the app, its six sections, live URL, and npm scripts from `package.json`.
- **src/App.jsx**: Added `aria-label` to `<nav>` and renamed `Sine Waves` to `Sound Waves` and `Example Analysis` to `Audio Analysis` to match each tab's content.
- **src/components/SoundChainReaction.jsx**: Changed `How is sound created?` to `How sound is created` for parallel phrasing with the other section headings and trimmed repetitive wording.
- **src/components/AirMolecule.jsx**: Added `aria-label` to controls and SVGs, replaced `Areas of:` with `Pressure zones:`, rewrote `=` bullet shorthand in plain English, and fixed the sine wave description so pressure changes do not appear to cause vibrations.
- **src/components/SoundProcessing.jsx**: Changed heading to `How the ear and brain process sound`, aligned stage titles with panel headings (`Eardrum Vibration`, `Cochlear Fluid Waves`, `Hair Cell Response`, `Neural Signals`), and added descriptive `aria-label` text to playback and stage buttons.
- **src/components/ComputerSoundProcessing.jsx**: Removed hyphens used as dashes in stage descriptions, aligned stage and panel titles (`Binary Encoding`, `Digital Signal Processing`), trimmed filler wording, and added `aria-label` text to controls.
- **src/components/NotesAndWaves.jsx**: Replaced the duplicate `Sound Physics Visualizer` heading with `Notes and Waves`, showed note frequency on the Play/Stop button, and added `aria-label` text to note buttons, canvas, and harmonic sliders.
- **src/components/Harmonics.jsx**: Tightened intro and bullet copy to reduce repetition and added `aria-label` text to the canvas and sliders.
- **src/components/SineWaveExplainer.jsx**: Standardized `Wave Type` to `Wave Shape` to match the explanation list, lowercased `hertz (Hz)`, simplified intro and bullet copy, and added `aria-label` text to the canvas, sliders, and select trigger.
- **src/components/FourierTransform.jsx**: Standardized `Wave Type` to `Wave Shape`, simplified the intro and domain definitions, and added `aria-label` text to both canvases, the select trigger, and the harmonics slider.
- **src/components/ExampleAnalysis.jsx**: Replaced the dash in the title with a colon, changed the playback button to `Play clip` / `Pause clip`, aligned the spectrogram color description with the code's green-to-red HSL scale, fixed `real-time` to `in real time`, renamed `Time Domain` to `Time Axis`, and added `aria-label` text to canvases and the playback slider.

## Left Alone on Purpose

- **Unused components** (`InstrumentAcoustics.jsx`, `SoundCreation.jsx`, `SineWaveToSound.jsx`, and the unexported `App` function in `src/App.jsx`): Not rendered in the live app, so skipped to keep changes focused.
- **`BEETHOVEN_CLIP_URL` in `ExampleAnalysis.jsx`**: Still points to `https://example.com/beethoven_5th_10s.mp3`; left untouched because URLs and logic are out of scope.
- **Technical constants and musical notation**: Note names (`C4` through `B4`), frequencies, harmonic formulas (`1/n`, `1/n²`), and `44,100` / `65,536` digital audio figures are accurate and left intact.

## Not Done (Next Pass)

- **Audio error and loading states**: `ExampleAnalysis.jsx` needs a real audio URL plus loading and error messages if playback fails, and `NotesAndWaves.jsx`, `Harmonics.jsx`, and `SineWaveExplainer.jsx` could surface a message if browser audio context startup is blocked.
- **Intro copy for Notes and Waves**: Adding a brief explanatory paragraph requires adding a new DOM element, so it was deferred to keep layout unchanged.
