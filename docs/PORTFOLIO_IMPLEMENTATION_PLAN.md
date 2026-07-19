# Portfolio implementation plan

## Stack decision

Retain the static HTML/CSS/JavaScript stack. The content does not require a framework, and avoiding a rewrite keeps deployment simple, preserves fast initial loading, and minimizes dependencies.

## Component model

- Semantic section modules in `index.html`
- A dedicated `spacelumin.html` page for detailed architecture, evaluation modes, and constraints
- Reusable buttons, cards, status chips, evidence rows, and capability groups in `style.css`
- Minimal progressive enhancement in `script.js` for mobile navigation, active-section state, and copy-to-clipboard behavior
- CSS/SVG architecture diagram with no external rendering library

## Visual system

- Dark neutral background with a low-contrast technical grid
- Teal primary accent, amber evaluation accent, and neutral planned state
- System font stack and monospace labels for low latency and consistent rendering
- Strong spacing and borders instead of glow-heavy effects
- Motion limited to short entry transitions with a full reduced-motion override

## Accessibility

- Skip link and semantic landmarks
- Native links/buttons with visible focus states
- Keyboard-operable mobile navigation
- Programmatic expanded state and focus return
- Descriptive external-link labels
- High-contrast status labels that do not rely on color alone
- Reduced-motion support and no custom cursor/audio

## Performance and metadata

- Remove canvas, audio, certificate-gallery data, cursor effects, calculator, tilt, and mode-switching code
- Remove external font requests
- Add favicon, web manifest, robots, sitemap, canonical URL, Open Graph, and Twitter metadata
- Keep JavaScript deferred and small
- No analytics, cookies, trackers, or third-party visual assets

## Verification

1. Serve the site with a local static server.
2. Validate internal file links and fragment targets.
3. Test 360, 768, 1024, and 1440 pixel widths.
4. Check homepage and CV at each representative breakpoint.
5. Test mobile navigation, skip link, visible focus, and print layout.
6. Emulate reduced motion.
7. Inspect console errors, failed requests, broken images, and horizontal overflow.
8. Stop after local review and commits. Do not push or deploy until the portfolio owner approves the branch.
