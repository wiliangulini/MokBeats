---
paths:
  - "src/app/player/**/*.ts"
  - "src/app/player/**/*.html"
  - "src/app/player/**/*.scss"
  - "src/app/services/music-player.service.ts"
  - "src/app/wave-surfer-test/**/*"
---

# Player and waveform

Derived from `docs/areas/player-and-waveform.md` (PROJECT_RULES.md §9.5); if this file diverges, update the project rule first.

- Preserve WaveSurfer lifecycle and existing playback flow.
- Destroy or reuse instances correctly; do not allow multiple audio instances to leak.
- Keep metadata, track switching, and preview behavior consistent with existing service contracts.
- Prefer localized fixes over rewrites.
- Do not remove WaveSurfer.js or substitute it without explicit authorization.