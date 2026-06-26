# Clara Mission Briefing Card — Design Spec
**Date:** 2026-06-27
**Status:** Approved for implementation

---

## Problem

When a user enters a Content Engine studio (Text / Image / Video / Audio) the emotional register drops from "game" to "form". The gamified shell (loader animation, congratulations dialog, sidebar progression) creates high engagement, but the studio flows immediately present traditional input screens that feel like work. The client described it as: *"my expectations go back to zero."*

## Solution

A game-style animated character — **Clara** — delivers a short energising briefing before each studio session begins. The interaction is brief, visual, and feels like accepting a mission rather than opening a form. It maintains the game emotional register across the boundary between the shell and the studio.

---

## Approach: Mission Card Slide-up (Approach C)

A card slides up from the bottom of the screen when the user selects a studio. Clara delivers her line typewriter-style. The user taps "Lock in →" and the card dismisses into the studio flow. Does not block or delay — exits cleanly and never forces the user to wait.

---

## Trigger

Fires when the user clicks any studio card on the Content Engine home screen:
- Text Studio
- Image Studio
- Video Studio
- Audio Studio

The card appears BEFORE the `StudioFlow` component mounts. It sits between "studio card clicked" and "first studio step rendered."

---

## Clara's Avatar

**Visual:**
- Inline SVG, circular portrait (~96px diameter)
- Geometric, abstract — not photorealistic
- Two dot eyes + subtle arc mouth
- Ambient glow ring slowly rotating around the circle perimeter

**Idle animation (CSS):**
- Scale pulse: `1.0 → 1.03 → 1.0` on a 2.4s loop (`ease-in-out`)
- Glow ring: `rotate(0deg → 360deg)` on a 4s loop (`linear`)

**Accent colour per modality:**
| Studio | Accent token |
|--------|-------------|
| Text   | `--clr-text-mod` (teal) |
| Image  | `--clr-image-mod` (amber) |
| Video  | `--clr-video-mod` (ember coral) |
| Audio  | `--clr-audio-mod` (violet) |

---

## Dialogue

Rendered character-by-character (typewriter effect, 12ms per character).

| Studio | Bold opener | Continuation |
|--------|-------------|--------------|
| Text   | "One post. One idea." | " Let's write something worth reading." |
| Image  | "One frame stops the scroll." | " Let's make it unmistakable." |
| Video  | "Lights on, Director." | " Your audience is scrolling — let's make them stop." |
| Audio  | "Ears up. Mic's hot." | " Let's put something in their head they won't shake." |

Bold opener renders in modality accent colour. Continuation renders in `--clr-text` (white).

---

## Card Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Clara avatar — animated SVG]                     │
│                                                     │
│   "Lights on, Director. Your audience is            │
│    scrolling — let's make them stop."               │
│                                                     │
│   [        Lock in →        ]   [Skip]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Card: `max-width: 480px`, centred, `border-radius: var(--radius-lg)`
- Background: `var(--clr-card)` with a 1px modality-coloured border
- Subtle ambient glow behind card matching modality colour
- Backdrop: rest of screen dims to `rgba(11,15,14,0.72)` (overlay)

---

## Animations

### Entry
- Backdrop fades in: `opacity 0 → 1`, `200ms ease`
- Card: `translateY(60px) → translateY(0)` + `opacity 0 → 1`
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring overshoot)
- Duration: `380ms`
- Clara avatar fades in `80ms` after card settles

### Typewriter
- Starts `120ms` after card entry completes
- 12ms per character
- Bold opener types first, then continuation
- Cursor blink (`|`) during typing, disappears on completion

### Exit (on "Lock in →" click)
- Card: `translateY(-20px)` + `opacity → 0`, `220ms cubic-bezier(0.4,0,1,1)`
- Backdrop fades out simultaneously
- Studio `StudioFlow` mounts and fades in behind

---

## Repeat Visit Behaviour

- **First visit per modality:** Full animation plays, user must click "Lock in →" or "Skip"
- **Subsequent visits:** Card still appears but auto-dismisses after `1800ms` if the user doesn't interact — typewriter still plays, just doesn't wait for a click

Tracked in `localStorage`:
- Key: `clarity_briefed_<modality>` (e.g. `clarity_briefed_video`)
- Set to `'1'` when the user clicks "Lock in →" or "Skip" for the first time

---

## Buttons

**Primary — "Lock in →"**
- Modality accent colour
- Full width on mobile, `min-width: 160px` on desktop
- Clicking it marks `localStorage` key + begins exit animation

**Ghost — "Skip"**
- Small, `font-size: 12px`, `color: var(--clr-muted)`
- Positioned bottom-right of the card
- Immediate dismiss, no animation (power user shortcut)
- Does NOT set the localStorage key (skip always shows the card, just auto-dismisses)

---

## Implementation Scope

**Files to create:**
- `js/clara-briefing.js` — self-contained component (`ClaraBriefing`), exposes `window.ClaraBriefing`

**Files to modify:**
- `js/screens.js` — `StudioLaunchpad` renders `ClaraBriefing` before `StudioFlow` mounts; passes `studioKey` and an `onReady` callback
- `css/app.css` — keyframe animations for avatar idle, glow ring, typewriter cursor

**No new dependencies.** Pure CSS animations + vanilla JS typewriter. No Lottie, no extra libraries.

---

## Out of Scope

- Clara reacting to user choices mid-flow (Approach B behaviour) — future iteration
- Audio/sound effects on the briefing
- Different avatars per modality (same Clara, different accent colour)
- Mobile-specific layout adjustments beyond `max-width` capping
