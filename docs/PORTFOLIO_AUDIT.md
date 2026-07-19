# Portfolio audit

Audit date: 2026-07-19  
Production URL: https://alisibai.vercel.app/  
Production repository: `sibaiali/alisibai`

## Executive finding

The previous site did not establish a clear engineering identity within the first screen. It presented a final-year student seeking an internship, distributed attention across weakly evidenced projects, and gave certificates, competitions, and speculative claims the same visual weight as working software.

The strongest recruiting story is narrower: a Computer Engineering graduate who built a playable browser game and instrumented it for measurable real-time player-state prediction.

## Current-site problems

### Positioning

- Outdated student and expected-graduation language appeared in metadata, the hero, education, contact copy, and CV.
- The primary identity mixed software development, project management, competitions, and research without a clear role target.
- The site asked recruiters to interpret a large amount of content before reaching the most relevant project.
- The contact section still focused on an internship rather than engineering opportunities.

### Claims and evidence

| Previous claim | Classification | Action |
| --- | --- | --- |
| Current/final-year student, expected graduation June 2026 | Outdated | Replace with B.Sc. Computer Engineering, graduated 2026. |
| Submitted to TUBITAK / active national research project | Unverified in the portfolio repository | Remove. |
| Predicts the player's next mistake | Exaggerated | Replace with next-state prediction from encoded telemetry. |
| Enemy DNA and difficulty already adapt to predictions | Unsupported by the verified runtime status | Remove; document that Director multipliers are not yet consumed by gameplay. |
| Proprietary HPIM algorithm | Unsupported legal/originality claim | Remove. |
| Guaranteed 60 FPS on mobile | Unsupported benchmark claim | Remove. |
| Full Agile/Scrum lifecycle for solo or course projects | Plausible but unverified and low-value | Remove. |
| Regular Kaggle competition participation | Plausible but unverified and not supported by linked evidence | Remove from the primary portfolio. |
| NEST SafePod implemented with AES-256/KVKK compliance and exact financial outcomes | Unsupported implementation/compliance claims | Remove from the homepage. |
| NLP human evaluation study completed | Unsupported by accessible implementation evidence | Reframe as a course research paper proposing a behavioral evaluation framework. |
| SpaceLumin playable browser game | Verified by public build/repository | Keep and make primary. |
| 16/16 deterministic evaluator tests | Verified by current project status and repository test architecture | Keep with explicit scope. |

### Information architecture and UX

- A fixed sidebar reduced usable space and became a long stacked preface on mobile.
- Project cards repeated large amounts of markup and visually treated speculative concepts like implemented systems.
- The custom cursor, animated background, hover sounds, mode switching, certificate PIN gate, match calculator, glow, tilt, and typing effects distracted from engineering evidence.
- Multiple content modes made navigation and keyboard behavior harder to understand.
- The CV link was described as a download even though it opened an HTML page, and the CV itself repeated outdated claims.

### Accessibility and performance

- The custom cursor used `cursor: none`, reducing familiarity and usability.
- Audio feedback and motion-heavy canvas effects were unnecessary.
- Interactive certificate cards were generated with click handlers instead of native links.
- Google-hosted font requests and an animated canvas added initial work without improving recruiter comprehension.
- The previous page had no skip link, no mobile navigation control, and no clear reduced-motion strategy across all effects.

### Technical and deployment

- The production site is a static HTML/CSS/JavaScript deployment connected to `sibaiali/alisibai` on Vercel.
- The workspace initially had no `.git` directory and contained a newer untracked local version. That local state was preserved on the recoverable `local-pre-redesign-snapshot` branch before work continued from production history.
- There was no manifest, sitemap, robots file, or consistent favicon in the production repository.
- The previous script contained unrelated systems for certificates, audio, a custom cursor, canvas animation, calculators, mode switching, and card tilt.

## Assets retained

- `docs/CE472_ResearchPaper_NLP.pdf` as supporting research evidence.
- `docs/Sibai-Ali-210502786-ERM416-Part2.pdf` only as an existing repository artifact; it is not featured without stronger technical implementation evidence.
- `docs/AIConsciousness_AliSibai_TermPaper.pdf` remains in history/repository but is removed from the primary homepage path.

## Recommended outcome

Use one recruiter path: focused hero, dominant SpaceLumin case study, two supporting projects, demonstrated capabilities, concise experience and education, and direct contact. Every performance, research, and adaptive-system claim should be either linked to evidence or explicitly marked as in evaluation/planned.
