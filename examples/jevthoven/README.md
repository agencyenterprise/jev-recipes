# Jevthoven: music built from small decisions

[Open Jevthoven](https://jev-ai-music.com/). Choose a style, key, and tempo, then sign in to play. The interface displays musical decisions alongside a piano roll. Jevthoven is built by the jev-recipes maintainer at AE Studio.

## How the package fits

The application prepares musical context and a menu of possible actions. Recipes ask Jev to judge those possibilities. Application code samples or selects from the results, turns the choices into note events, and schedules playback. The model returns decisions and probabilities; the application produces the audio.

```text
Style, key, tempo, and recent music
  → application builds candidate notes, chords, and gestures
  → jev-recipes asks focused questions
  → application selects or samples from returned probabilities
  → composition engine creates and buffers note events
  → browser schedules instrument playback and displays decisions
```

The supplied local source imports 13 recipe entry points across two styles:

| Musical decision               | Recipes                                                                                                                                                                            | What the application owns                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Write a theme                  | [next-note](../../recipes/next-note/README.md), [next-duration](../../recipes/next-duration/README.md)                                                                             | Candidate pitches, available durations, note range, and theme state  |
| Choose harmony                 | [next-chord](../../recipes/next-chord/README.md)                                                                                                                                   | Chord vocabulary, voicing, and cadence constraints                   |
| Design movements and gestures  | [choose-action](../../recipes/choose-action/README.md)                                                                                                                             | Possible forms, sections, techniques, and transitions                |
| Shape expression               | [dynamic-change](../../recipes/dynamic-change/README.md), [tempo-change](../../recipes/tempo-change/README.md)                                                                     | Velocity and tempo bounds, and timing                                |
| Assess a phrase                | [phrase-complete](../../recipes/phrase-complete/README.md), [tension-level](../../recipes/tension-level/README.md), [modulation-moment](../../recipes/modulation-moment/README.md) | Section state and the rules for changing section or key              |
| Respond to repetition or drift | [repetition-level](../../recipes/repetition-level/README.md), [goal-drift](../../recipes/goal-drift/README.md), [progress-stall](../../recipes/progress-stall/README.md)           | Observations of played notes and changes to the next candidate menu  |
| Write riffs and solo phrases   | [finger-actions](../../recipes/finger-actions/README.md)                                                                                                                           | Slots and options, hand constraints, held notes, and event rendering |

## Creative uncertainty is an application policy

Several creative calls explicitly use `minConfidence: 0`. The application samples probability distributions or uses suggested choices and application fallbacks to keep music moving. It does not require human approval for every ambiguous musical choice. That is a deliberate creative policy, not a pattern to copy into tool permissions or other consequential decisions.

The session engine composes ahead of the listener, applies timeouts, retries selected failures, and stops on unrecoverable failures. Decision traces carry the model, usage, and choices; recording can also retain raw exchanges. The browser handles audio timing. Credentials and Jev requests stay in the server-side composer.

## What was verified

On September 27, 2026:

- The public page loaded, displayed style/key/tempo controls, and credited jev-recipes. Playback required sign-in, so deployed audio playback was not tested in this review.
- The owner supplied local source. Its `composer/package.json` pins **jev-recipes 0.8.1**; the deployed version was not established. This is an integration example, not a claim that the music app runs 0.8.2.
- The local composer suite passed **30 offline tests**, including composition, held-note handling, session recovery, and recorded decision traces. These tests use fake Jev responses and do not measure live musical quality, latency, or cost.

The source paths supporting the walkthrough are `composer/styles/jevthoven/theme.ts`, `composer/styles/jevthoven/unit/{harmony,choices,critics,plan}.ts`, `composer/styles/jevthoven/movement/`, `composer/styles/jevthoven-2/beat/`, `composer/engine/jev/`, `composer/engine/session/composer-session.ts`, and `web/player/piano.js`. The source was inspected locally; this guide does not imply a publicly available application repository or that local source matches the deployment.

## Try the recipe interface

These commands run saved fixtures without signing into the music app or calling a model:

```sh
npx jev-recipes demo next-note
npx jev-recipes describe next-chord
npx jev-recipes demo finger-actions
```

For a general application, start with [routing, evidence selection, or action review](../getting-started/README.md). For music, browse [Music & sound](../../recipes/README.md#music--sound). A maintainer-built app demonstrates integration; independent adoption and recipe accuracy require separate evidence.
