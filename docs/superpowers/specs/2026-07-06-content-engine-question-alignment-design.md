# Content-Engine Wizard — Question Alignment Spec

**Date:** 2026-07-06
**Goal:** Make the questions asked by *my* Content-Engine creation wizard identical to my
friend's `clarity-launchpad` implementation. The launchpad is the single source of truth.

## Source-of-truth mapping

| Concern | Reference (friend) | Mine (to change) |
|---|---|---|
| Content-Engine creation wizard | `clarity-launchpad/studio-create/create-flow.js` | `js/wizard.js` (`SFStudioFlow` = `window.StudioFlow`) |
| Question/option data | inline `CF_*` structures in `create-flow.js` | `js/data.js` (`STUDIO_FLOW`, `TEXT_BRIEF`, `IMAGE_BRIEF`, `AUDIO_GOALS`, `ADV`, …) |
| Wizard entry | `setMode('wizard')` → `screenCreateFlow()` | `content.js` renders `window.StudioFlow` in a portal |

## Decisions (locked with user)

1. **Full structural match** — restructure `wizard.js` + `data.js` so the flow matches the
   launchpad exactly, including a real Format-picker step and the strategic Brief step.
2. **Launchpad wins everywhere** — add every question the launchpad asks; remove/replace any
   question mine asks that the launchpad does not.
3. **Match launchpad's sample data too** — persona `Maya Holloway` / `Alex Rivera` /
   `All segments`, brand `Hearth Bakery`, launchpad's pre-filled brief text and A/B/C variations.
4. **Approach: port into the React wizard** — keep my design system (`SFCard`, `SFSelect`,
   `SFChips`, `SFSwitch`, …) and the `content.js` portal; do **not** wholesale-copy the vanilla-JS
   `create-flow.js`.

## Step spine (both are 5 steps)

`What → Where → Format → Brief → Generate`

Note the current mismatch being corrected: my step 2 (labelled "Format") currently renders
per-modality **control specs** ("Set the brief"), and my step 3 ("Brief") renders a light
per-modality creative input. After this change, step 2 becomes a **format picker** and step 3
becomes the **strategic brief + creative controls** — matching the launchpad.

---

## STEP 1 — Select content type (`What`)

- **Title:** `Select content type`
- **Sub:** `Choose the format for this piece of content.`
- **Options (id → name → desc):**
  - `text` → **Written** → "Posts, articles, email, threads"
  - `image` → **Image** → "Feed posts, carousels, banners"
  - `video` → **Video** → "Short-form, long-form, ads"
  - `audio` → **Audio** → "Podcast, voiceover, ad spot"

## STEP 2 — Publishing platform (`Where`)

- **Title:** `Publishing platform`
- **Sub:** `Select the platform this content is being created for.`
- **Platforms per modality (id → desc):**
  - text: `LinkedIn`→"Posts, articles", `Instagram`→"Captions, stories", `X`→"Tweets, threads", `Email`→"Newsletters"
  - image: `Instagram`→"Feed, Stories", `LinkedIn`→"Banners, carousels", `Facebook`→"Reels, feed", `Pinterest`→"Pins"
  - video: `Instagram`→"Reels", `Facebook`→"Reels, feed", `YouTube`→"Shorts, long", `TikTok`→"Covers"
  - audio: `Spotify`→"Podcast", `Apple`→"Podcasts", `YouTube`→"Video podcast"
- **Remove** the current audio-only "What kind of audio?" goal step (`AUDIO_GOALS`
  podcast/ad/narration/elearning/social). Audio uses the platform tiles above.

## STEP 3 — Format (new real picker)

- **Title:** `Format`
- **Sub:** `Pre-set to {platform} standards. Change if needed.`
- **Format chips per platform** (id + meta), with a **Recommended** badge on the suggested index,
  a recommendation note under the chips, and a live preview mockup.
- **Formats:**
  - text/LinkedIn: `Post` (1,300 chars), `Article` (125k chars)
  - text/Instagram: `Caption` (2,200 chars), `Story text` (220 chars)
  - text/X: `Single tweet` (280 chars), `Thread` (280/tweet)
  - text/Email: `Newsletter` (No limit)
  - image/Instagram: `Portrait 4:5` (4:5, 1080×1350), `Feed 1:1` (1:1, 1080×1080), `Story 9:16` (9:16, 1080×1920)
  - image/LinkedIn: `Banner 1.91:1` (1.91:1, 1200×627), `Square 1:1` (1:1, 1200×1200)
  - image/Facebook: `Reel cover 9:16` (9:16, 1080×1920), `Feed 1:1` (1:1, 1080×1080)
  - image/Pinterest: `Pin 2:3` (4:5, 1000×1500)
  - video/Instagram: `Reel 9:16` (9:16, 0:30), `Story 9:16` (9:16, 0:15)
  - video/Facebook: `Reel 9:16` (9:16, 0:30), `Feed 1:1` (1:1, 0:45)
  - video/YouTube: `Short 9:16` (9:16, 0:60), `Long 16:9` (16:9, 3:00)
  - video/TikTok: `Cover 9:16` (9:16, 0:30)
  - audio/Spotify: `Episode` (25–45 min), `Short clip` (3–5 min)
  - audio/Apple: `Episode` (25–45 min)
  - audio/YouTube: `Video podcast` (20–60 min)
- **Recommended index** (`CF_SUGGESTED`) and **why-notes** (`CF_SUGGEST_WHY`) — port verbatim.
  e.g. text:LinkedIn→0 "Long-form Posts drive the most reach on LinkedIn"; text:X→1
  "Threads earn more impressions than single tweets"; image:LinkedIn→1 "Square 1:1 reads best…"; etc.

## STEP 4 — Write the creative brief (`Brief`)

- **Title:** `Write the creative brief`
- **Sub:** `{brand} · lock the strategy your generator will execute`
- **Context pills:** modality · platform · format · "Used for all generated variations."
- **Strategy card** ("Define the goal and timing context for this piece of content."):
  - **Campaign objective** — input, placeholder "What measurable outcome do we want?",
    help "Example: Drive weekend pre-orders from existing Instagram followers." → `brief.goal`
  - **Why this moment** — input, placeholder "Why this campaign now?",
    help "Example: Summer menu launch + Saturday footfall spike." → `brief.whyNow`
- **Message card** ("Who you're talking to, what to say, and what makes it credible."):
  - **Primary persona** — select `Maya Holloway` / `Alex Rivera` / `All segments`
    (prepend active concept-persona if present), help "Who this message should feel written for." → `brief.persona`
  - **Core message** — textarea, label note "— single clear sentence",
    placeholder "What is the one idea the audience must remember?",
    help "Keep it sharp: offer + differentiator + urgency." → `brief.message`
  - **Proof points** — input, placeholder "What makes this claim credible?",
    help "Ingredients, process, data, social proof." → `brief.proof`
  - **Call to action** — input, placeholder "What exactly should people do next?",
    help "Example: Pre-order now. Pickup Saturday 8–11 AM." → `brief.cta`
- **{Modality} controls** ("Shape how this {modality} is generated."):
  - text: **Word count** (Short ~60 / Medium ~120 / Long ~250) · **Tone** (Match brand tone / Warm / Bold / Professional / Playful) · **Format style** (Story-led / Listicle / Punchy one-liner / Q&A / hook)
  - image: **Aspect ratio** (read-only from format) · **Style direction** (Editorial craft / Minimal clean / Bold promo / Documentary / BTS) · **Color palette** (from brand kit) · **Text overlay** (toggle)
  - video: **Video type** (ro) · **Duration** (ro) · **Aspect ratio** (ro) · **Visual style** (Casual / UGC / Cinematic / Animated / Motion graphics / Documentary BTS) · **Burn-in captions** (toggle) · **Script or scene description** (textarea, placeholder "Key scenes, dialogue, or shot list…")
  - audio: **Audio type** (ro) · **Duration** (ro) · **Voice style** (Conversational / Calm / Energetic / Professional) · **Background music** (toggle) · **Script or talking points** (textarea, placeholder "Key messages, bullet points, or full script…")
- **Control defaults:** text {Medium, Match brand tone, Story-led}; image {Editorial craft,
  first brand color, overlay on}; video {Casual / UGC, captions on}; audio {Conversational, music on}.

## STEP 5 — Generate

- Keep existing generate behavior (3 A/B/C variations scored for persona fit + progress steps).
- Progress steps → `Applying brand kit… / Loading persona context… / Generating variations… / Scoring persona fit…`
- Swap sample variations to the launchpad's `CF_TEXT_VARS` / `CF_IMAGE_VARS` / `CF_VIDEO_VARS` /
  `CF_AUDIO_VARS`.

## Sample data (match launchpad)

- **Brand:** `Hearth Bakery`
- **Persona (default):** `Maya Holloway` — "Local foodie · 28–45 · drives for quality"
- **Pre-filled brief defaults:**
  - goal `Drive weekend pre-orders`
  - message `Sourdough Saturday is back — 72-hour cold ferment, stone-baked, limited batch. Craft over convenience.`
  - whyNow `Seasonal launch · Summer 2026`
  - proof `68% of food-tech startups shuttered since 2023; artisan bakeries grew 14% CAGR.`
  - cta `Pre-order now — closes Friday at 6 PM.`
- **Aria hints** in the wizard retuned to Maya / Hearth Bakery instead of "The Artisan Loyalist".

## Files to change

- **`js/data.js`**
  - Rewrite `STUDIO_FLOW` per modality: `{ modality label+desc, platforms[], formats{platform:[]},
    suggestedIndex{}, suggestWhy{}, controls[] }`.
  - Add brief field metadata (labels/placeholders/help) + sample brief defaults + sample variations.
  - Retire `AUDIO_GOALS` usage from the content wizard (may stay defined if referenced elsewhere —
    verify before deleting).
- **`js/wizard.js`**
  - Step 1: modality picker copy → launchpad.
  - Step 2: platform picker → launchpad sets; delete the audio-goal branch.
  - Step 3: **new** Format-picker render (chips + recommended + why + preview).
  - Step 4: **strategic brief** (Strategy + Message cards) + per-modality creative controls
    (replacing the current light per-modality brief and the old "specs" step).
  - Step 5: variations sourced from launchpad sample data; brand/persona references → Hearth/Maya.

## Out of scope

- Re-theming Intelligence / Persona / Campaigns / Tasks screens. Only the Content-Engine wizard
  (`wizard.js`) and the data it consumes change. A persona-name seam elsewhere in the app is an
  accepted trade-off.
- The launchpad's per-modality studios (`studio-text.js`, `studio-video.js`, …) — these are a
  separate/secondary path, not the main Content-Engine wizard, and are not being mirrored.
- Pixel-perfect visual parity — we match **questions, options, order, labels, sample data**, rendered
  in my existing design system.

## Verification

- Walk all four modalities through all five steps; confirm each step's title, sub, field labels,
  option-lists, defaults, recommended badges, and sample data match `create-flow.js`.
- Confirm the audio "goals" step no longer appears and audio uses Spotify/Apple/YouTube.
- Confirm no console errors and the `content.js` portal still opens/closes the wizard.
