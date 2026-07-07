/* Clarity — demo reference data (Hearth Bakery continuity). Plain globals. */
window.ClarityData = (function () {
  const ENGINE_STRATEGY = {
    brand: 'Hearth Bakery',
    cards: [
      { label: 'Persona', icon: 'Target', title: 'The Artisan Loyalist', body: '28–45, values craft & provenance. Shops local weekly, follows makers, pays a premium for transparency.' },
      { label: 'Market Intelligence', icon: 'TrendingUp', title: 'Craft demand is rising', body: 'Premium local-bakery demand +18% YoY. Mass-produced fatigue is high; the gap is honest behind-the-craft storytelling.' },
      { label: 'Positioning', icon: 'Compass', title: 'Quality over volume', body: 'Slow-fermented, community-first. We win on trust and story — not on price or scale.' },
    ],
  };

  const STUDIOS = [
    { key: 'text', name: 'Text', icon: 'Type', accent: 'var(--clr-text-mod)', tag: 'Emails, newsletters, blogs and social posts — in your brand voice.', ex: ['Email', 'Newsletter', 'Blog', 'Caption'] },
    { key: 'image', name: 'Image', icon: 'Image', accent: 'var(--clr-image-mod)', tag: 'On-brand visuals and social creative, refined on a layer canvas.', ex: ['Feed', 'Story', 'Poster', 'Ad'] },
    { key: 'video', name: 'Video', icon: 'Video', accent: 'var(--clr-video-mod)', tag: 'Short-form reels and long-form video with an AI go-to-market plan.', ex: ['Reel', 'Short', 'YouTube', 'Ad'] },
    { key: 'audio', name: 'Audio', icon: 'Mic', accent: 'var(--clr-audio-mod)', tag: 'Podcasts, voiceovers and audio ads — start from a goal, not a blank track.', ex: ['Podcast', 'Voiceover', 'Ad', 'Narration'] },
  ];

  // --- Studio Create / Content-Engine flow. Ported to match the clarity-launchpad
  // reference (studio-create/create-flow.js): the 5-step spine is
  //   What (modality) → Where (platform) → Format → Brief → Generate.
  // Per modality: launchpad label/desc, platform set, per-platform formats (with the
  // recommended index + why-note), the creative controls shown in the Brief step, and
  // the sample A/B/C variation angles. ---
  const STUDIO_FLOW = {
    text: {
      label: 'Written', desc: 'Posts, articles, email, threads',
      platforms: [
        { type: 'LinkedIn', icon: 'Briefcase', label: 'LinkedIn', desc: 'Posts, articles', rec: true, reason: 'long-form posts let the craft story land with the widest reach.' },
        { type: 'Instagram', icon: 'Instagram', label: 'Instagram', desc: 'Captions, stories', reason: '' },
        { type: 'X', icon: 'Hash', label: 'X', desc: 'Tweets, threads', reason: '' },
        { type: 'Email', icon: 'Mail', label: 'Email', desc: 'Newsletters', reason: '' },
      ],
      formats: {
        LinkedIn:  [{ id: 'Post', limit: '1,300 chars' }, { id: 'Article', limit: '125k chars' }],
        Instagram: [{ id: 'Caption', limit: '2,200 chars' }, { id: 'Story text', limit: '220 chars' }],
        X:         [{ id: 'Single tweet', limit: '280 chars' }, { id: 'Thread', limit: '280/tweet' }],
        Email:     [{ id: 'Newsletter', limit: 'No limit' }],
      },
      suggested:  { LinkedIn: 0, Instagram: 0, X: 1, Email: 0 },
      suggestWhy: {
        LinkedIn:  'Long-form Posts drive the most reach on LinkedIn',
        Instagram: 'Captions outperform Story text for feed engagement',
        X:         'Threads earn more impressions than single tweets',
        Email:     'Newsletter is the only native long-form email format',
      },
      controls: [
        { key: 'length', label: 'Word count', type: 'select', opts: ['Short (~60 words)', 'Medium (~120 words)', 'Long (~250 words)'], default: 'Medium (~120 words)' },
        { key: 'tone', label: 'Tone', type: 'select', opts: ['Match brand tone', 'Warm', 'Bold', 'Professional', 'Playful'], default: 'Match brand tone' },
        { key: 'style', label: 'Format style', type: 'select', opts: ['Story-led', 'Listicle', 'Punchy one-liner', 'Q&A / hook'], default: 'Story-led' },
      ],
      angles: [
        { angle: 'Contrarian hook → craft moat → CTA', desc: 'Uses market-gap data — ghost kitchen vs artisan CAGR.', fit: 81 },
        { angle: 'Hot take → stat proof → urgency CTA', desc: 'Best persona fit for Maya — data plus authenticity.', fit: 88 },
        { angle: 'Ritual → simplicity → soft CTA', desc: 'Process-story angle drawn from consumer research.', fit: 74 },
      ],
    },
    image: {
      label: 'Image', desc: 'Feed posts, carousels, banners',
      platforms: [
        { type: 'Instagram', icon: 'Instagram', label: 'Instagram', desc: 'Feed, Stories', rec: true, reason: 'a visual, craft-led product — the feed rewards beautiful, aspirational stills.' },
        { type: 'LinkedIn', icon: 'Briefcase', label: 'LinkedIn', desc: 'Banners, carousels', reason: '' },
        { type: 'Facebook', icon: 'Facebook', label: 'Facebook', desc: 'Reels, feed', reason: '' },
        { type: 'Pinterest', icon: 'Pin', label: 'Pinterest', desc: 'Pins', reason: '' },
      ],
      formats: {
        Instagram: [{ id: 'Portrait 4:5', aspect: '4:5', dims: '1080×1350' }, { id: 'Feed 1:1', aspect: '1:1', dims: '1080×1080' }, { id: 'Story 9:16', aspect: '9:16', dims: '1080×1920' }],
        LinkedIn:  [{ id: 'Banner 1.91:1', aspect: '1.91:1', dims: '1200×627' }, { id: 'Square 1:1', aspect: '1:1', dims: '1200×1200' }],
        Facebook:  [{ id: 'Reel cover 9:16', aspect: '9:16', dims: '1080×1920' }, { id: 'Feed 1:1', aspect: '1:1', dims: '1080×1080' }],
        Pinterest: [{ id: 'Pin 2:3', aspect: '4:5', dims: '1000×1500' }],
      },
      suggested:  { Instagram: 0, LinkedIn: 1, Facebook: 1, Pinterest: 0 },
      suggestWhy: {
        Instagram: 'Portrait 4:5 takes the most feed real estate',
        LinkedIn:  'Square 1:1 reads best in the LinkedIn feed',
        Facebook:  'Feed 1:1 is the safest crop for Facebook',
        Pinterest: 'Tall 2:3 pins get the highest save rate',
      },
      controls: [
        { key: 'aspect', label: 'Aspect ratio', type: 'format-aspect' },
        { key: 'styleDir', label: 'Style direction', type: 'select', opts: ['Editorial craft', 'Minimal clean', 'Bold promo', 'Documentary / BTS'], default: 'Editorial craft' },
        { key: 'palette', label: 'Color palette', type: 'palette' },
        { key: 'textOverlay', label: 'Text overlay', type: 'toggle', default: 'On' },
      ],
      angles: [
        { angle: 'Hero product · warm light · logo lockup', desc: 'Matches brand-kit colours and weekend urgency.', fit: 84 },
        { angle: 'Full-bleed craft · headline center', desc: 'Highest persona fit — process over convenience.', fit: 91 },
        { angle: 'Behind-the-scenes · text overlay', desc: 'Consumer research: ferment visuals +34% conversion.', fit: 76 },
      ],
    },
    video: {
      label: 'Video', desc: 'Short-form, long-form, ads',
      platforms: [
        { type: 'Instagram', icon: 'Instagram', label: 'Instagram', desc: 'Reels', rec: true, reason: 'a lifestyle product — Reels reward aspirational short-form video.' },
        { type: 'Facebook', icon: 'Facebook', label: 'Facebook', desc: 'Reels, feed', reason: '' },
        { type: 'YouTube', icon: 'Youtube', label: 'YouTube', desc: 'Shorts, long', reason: '' },
        { type: 'TikTok', icon: 'Music', label: 'TikTok', desc: 'Covers', reason: '' },
      ],
      formats: {
        Instagram: [{ id: 'Reel 9:16', aspect: '9:16', dur: '0:30' }, { id: 'Story 9:16', aspect: '9:16', dur: '0:15' }],
        Facebook:  [{ id: 'Reel 9:16', aspect: '9:16', dur: '0:30' }, { id: 'Feed 1:1', aspect: '1:1', dur: '0:45' }],
        YouTube:   [{ id: 'Short 9:16', aspect: '9:16', dur: '0:60' }, { id: 'Long 16:9', aspect: '16:9', dur: '3:00' }],
        TikTok:    [{ id: 'Cover 9:16', aspect: '9:16', dur: '0:30' }],
      },
      suggested:  { Instagram: 0, Facebook: 0, YouTube: 0, TikTok: 0 },
      suggestWhy: {
        Instagram: 'Reel 9:16 is the highest-distribution video format',
        Facebook:  'Reel 9:16 gets prioritized in Facebook video',
        YouTube:   'Shorts capture the most new-viewer reach',
        TikTok:    '9:16 cover is the native TikTok format',
      },
      controls: [
        { key: 'vtype', label: 'Video type', type: 'format-id' },
        { key: 'duration', label: 'Duration', type: 'format-dur' },
        { key: 'aspect', label: 'Aspect ratio', type: 'format-aspect' },
        { key: 'visualStyle', label: 'Visual style', type: 'select', opts: ['Casual / UGC', 'Cinematic', 'Animated / Motion graphics', 'Documentary BTS'], default: 'Casual / UGC' },
        { key: 'captions', label: 'Burn-in captions', type: 'toggle', default: 'On' },
        { key: 'script', label: 'Script or scene description', type: 'textarea', placeholder: 'Key scenes, dialogue, or shot list…' },
      ],
      angles: [
        { angle: 'Hook-first cut', desc: 'Scroll-stop hook aligned to persona fear and motivator.', fit: 90 },
        { angle: 'Story-driven cut', desc: 'Narrative arc from the brief and consumer trigger.', fit: 86 },
        { angle: 'Process montage', desc: 'Platform-native reel pacing for Instagram.', fit: 83 },
      ],
    },
    audio: {
      label: 'Audio', desc: 'Podcast, voiceover, ad spot',
      platforms: [
        { type: 'Spotify', icon: 'Headphones', label: 'Spotify', desc: 'Podcast', rec: true, reason: 'long-form trust-building — your loyalists listen on the commute.' },
        { type: 'Apple', icon: 'Podcast', label: 'Apple', desc: 'Podcasts', reason: '' },
        { type: 'YouTube', icon: 'Youtube', label: 'YouTube', desc: 'Video podcast', reason: '' },
      ],
      formats: {
        Spotify: [{ id: 'Episode', dur: '25–45 min' }, { id: 'Short clip', dur: '3–5 min' }],
        Apple:   [{ id: 'Episode', dur: '25–45 min' }],
        YouTube: [{ id: 'Video podcast', dur: '20–60 min' }],
      },
      suggested:  { Spotify: 0, Apple: 0, YouTube: 0 },
      suggestWhy: {
        Spotify: 'Full episodes build the strongest listener habit',
        Apple:   'Full episodes index best in Apple Podcasts',
        YouTube: 'Video podcast unlocks YouTube discovery',
      },
      controls: [
        { key: 'atype', label: 'Audio type', type: 'format-id' },
        { key: 'duration', label: 'Duration', type: 'format-dur' },
        { key: 'voiceStyle', label: 'Voice style', type: 'select', opts: ['Conversational', 'Calm', 'Energetic', 'Professional'], default: 'Conversational' },
        { key: 'musicBed', label: 'Background music', type: 'toggle', default: 'On' },
        { key: 'script', label: 'Script or talking points', type: 'textarea', placeholder: 'Key messages, bullet points, or full script…' },
      ],
      angles: [
        { angle: 'Interview + data segment', desc: 'Balances warmth with research credibility.', fit: 87 },
        { angle: 'Solo narrative', desc: 'Efficient solo format for a weekly cadence.', fit: 82 },
        { angle: 'Customer story focus', desc: 'Community motivator drawn from consumer research.', fit: 79 },
      ],
    },
  };

  // --- Creative-brief step (ported from create-flow.js cfStepBrief). Sample data
  // matches the launchpad: Hearth Bakery / Maya Holloway. ---
  const BRIEF = {
    brand: 'Hearth Bakery',
    personas: ['Maya Holloway', 'Alex Rivera', 'All segments'],
    palette: ['#d4a853', '#8c5a2b', '#e8dcc8', '#3a2417'],
    defaults: {
      goal:    'Drive weekend pre-orders',
      whyNow:  'Seasonal launch · Summer 2026',
      persona: 'Maya Holloway',
      message: 'Sourdough Saturday is back — 72-hour cold ferment, stone-baked, limited batch. Craft over convenience.',
      proof:   '68% of food-tech startups shuttered since 2023; artisan bakeries grew 14% CAGR.',
      cta:     'Pre-order now — closes Friday at 6 PM.',
    },
    fields: {
      goal:    { label: 'Campaign objective', placeholder: 'What measurable outcome do we want?', help: 'Example: Drive weekend pre-orders from existing Instagram followers.' },
      whyNow:  { label: 'Why this moment', placeholder: 'Why this campaign now?', help: 'Example: Summer menu launch + Saturday footfall spike.' },
      persona: { label: 'Primary persona', help: 'Who this message should feel written for.' },
      message: { label: 'Core message', note: '— single clear sentence', placeholder: 'What is the one idea the audience must remember?', help: 'Keep it sharp: offer + differentiator + urgency.' },
      proof:   { label: 'Proof points', placeholder: 'What makes this claim credible?', help: 'Ingredients, process, data, social proof.' },
      cta:     { label: 'Call to action', placeholder: 'What exactly should people do next?', help: 'Example: Pre-order now. Pickup Saturday 8–11 AM.' },
    },
  };

  // Campaign channels — matched to the clarity-launchpad campaign flow (CP_PLATFORMS).
  const CHANNELS = ['LinkedIn', 'Instagram', 'Facebook', 'Email', 'X', 'YouTube'];
  const CHANNEL_MOD = { LinkedIn: 'text', Instagram: 'image', Facebook: 'text', Email: 'text', X: 'text', YouTube: 'video' };
  const CHANNEL_DESC = { LinkedIn: 'B2B reach', Instagram: 'Visual + stories', Facebook: 'Broad local audience', Email: 'Owned audience', X: 'Real-time updates', YouTube: 'Long + short video' };

  const GOALS = [
    { id: 'preorders', label: 'Drive pre-orders / sales', kpi: 'Pre-orders', target: 500 },
    { id: 'awareness', label: 'Brand awareness', kpi: 'Reach', target: 250000 },
    { id: 'reengage', label: 'Re-engage past customers', kpi: 'Reactivations', target: 200 },
    { id: 'promote', label: 'Promote a product or event', kpi: 'Sign-ups', target: 300 },
    { id: 'community', label: 'Build community', kpi: 'New followers', target: 1000 },
  ];

  const CAMPAIGNS = [
    { id: 'c1', name: 'Summer Pre-order Push', goal: 'Drive pre-orders', status: 'running', window: 'Jun 1 – Jul 15', series: 2, pieces: 9, kpiLabel: 'Pre-orders', kpiNow: 320, kpiGoal: 500, pace: 64, target: 75, daysLeft: 12, reach: '48K', pfAvg: 84, published: 6, chips: ['Artisan Loyalist', 'Instagram', 'Email'] },
    { id: 'c2', name: 'Brand Authority', goal: 'Thought leadership', status: 'running', window: 'May 1 – Jun 30', series: 2, pieces: 8, kpiLabel: 'Reach', kpiNow: 287000, kpiGoal: 350000, pace: 82, target: 70, daysLeft: 6, reach: '287K', pfAvg: 86, published: 5, chips: ['Artisan Loyalist', 'LinkedIn', 'Podcast'] },
    { id: 'c3', name: 'Holiday Gifting', goal: 'Conversion', status: 'planned', window: 'Nov 15 – Dec 24', series: 0, pieces: 0, kpiLabel: 'Revenue', kpiNow: 0, kpiGoal: 100, pace: 0, target: 100, daysLeft: 144, reach: '—', pfAvg: 0, published: 0, chips: ['Gift Buyer', 'Instagram', 'TikTok'] },
  ];

  const SERIES = [
    { id: 's1', name: 'Sourdough Saturday Launch', pattern: 'Launch Countdown', items: 5, done: 3, status: 'active' },
    { id: 's2', name: 'Why Artisan Takes Patience', pattern: 'Educational Ladder', items: 4, done: 4, status: 'complete' },
    { id: 's3', name: 'Meet the 4am Bakers', pattern: 'Behind-the-Scenes', items: 4, done: 1, status: 'active' },
  ];

  // Maker's proposed plan for a fresh campaign — a campaign is several series.
  const CAMP_PLAN = [
    { name: 'Sourdough Saturday Launch', pattern: 'Launch Countdown', posts: 5, mods: ['image', 'text', 'video'] },
    { name: 'Meet the 4am Bakers', pattern: 'Behind-the-Scenes', posts: 4, mods: ['video', 'image'] },
    { name: 'Why Patience Wins', pattern: 'Educational Ladder', posts: 4, mods: ['text', 'image'] },
  ];

  // Batch grid for the review step. Each piece carries the `series` it belongs to,
  // so Advanced ("several ideas") mode can group the grid + campaign page by series,
  // while Simple ("one idea") mode just shows them flat.
  const CAMP_BATCH = [
    { title: "It's coming back — Sourdough Saturday", channel: 'Instagram', mod: 'image', pf: 88, series: 'launch' },
    { title: 'Why 72-hour cold ferment is worth the wait', channel: 'LinkedIn', mod: 'text', pf: 84, series: 'patience' },
    { title: 'What Millie said after 6 years of loaves', channel: 'Instagram', mod: 'image', pf: 91, series: 'launch' },
    { title: 'Pre-orders open — reserve before Friday', channel: 'Email', mod: 'text', pf: 87, series: 'launch' },
    { title: 'Meet the 4am bakers — a morning POV', channel: 'YouTube', mod: 'video', pf: 79, series: 'bts' },
    { title: 'The science of a 72-hour crumb', channel: 'LinkedIn', mod: 'text', pf: 90, series: 'patience' },
  ];

  // Advanced-mode series plan — what Maker proposes when the user has "several ideas
  // at once". A campaign = multiple series in parallel. Counts here sum to CAMP_BATCH.
  const CAMP_SERIES_PLAN = [
    { id: 'launch', name: 'Sourdough Saturday Launch', pattern: 'Launch Countdown', posts: 3, mods: ['image', 'text'], hint: 'Build anticipation to the Friday cut-off' },
    { id: 'bts', name: 'Meet the 4am Bakers', pattern: 'Behind-the-Scenes', posts: 1, mods: ['video'], hint: 'Trust through transparency' },
    { id: 'patience', name: 'Why Patience Wins', pattern: 'Educational Ladder', posts: 2, mods: ['text'], hint: 'Authority for Maya Holloway' },
  ];

  // Pillars — the gamified onboarding ladder. The user starts with only Intelligence
  // enabled; completing a pillar earns `reward` points and unlocks the next one.
  // Sequence (and sidebar order): Intelligence → Audience → Tasks → Content Engine → Campaigns.
  const PILLARS = [
    { id: 'intelligence', icon: 'Radar', label: 'Intelligence', accent: 'var(--clr-pillar-intelligence)', reward: 120, blurb: 'Market & competitor signal' },
    { id: 'audience', icon: 'Users', label: 'Audience', accent: 'var(--clr-pillar-audience)', reward: 100, blurb: 'Personas & segments' },
    { id: 'tasks', icon: 'ListChecks', label: 'Tasks', accent: 'var(--clr-pillar-tasks)', reward: 80, blurb: 'Your weekly plan' },
    { id: 'content', icon: 'Zap', label: 'Content Engine', accent: 'var(--clr-pillar-content)', reward: 200, blurb: 'Make any piece' },
    { id: 'campaigns', icon: 'Megaphone', label: 'Campaigns', accent: 'var(--clr-pillar-campaigns)', reward: 150, blurb: 'Coordinated pushes', parent: 'content' },
  ];
  // Total points needed to unlock free access to Clara (sum of all rewards).
  const CLARA_GOAL = PILLARS.reduce((a, p) => a + p.reward, 0);

  // Gamification: overall profile shown in the sidebar footer + Tasks pillar.
  const PROFILE = {
    level: 3, levelName: 'Operator', points: 250, nextLevel: 400,
    streak: 5,
    quests: [
      { label: 'Finish your market intelligence', done: true, pts: 120 },
      { label: 'Define your core persona', done: false, pts: 60 },
      { label: 'Create your first content piece', done: true, pts: 90 },
      { label: 'Launch your first campaign', done: false, pts: 150 },
    ],
  };

  // --- Campaign flow (the middle-ground, content-first flow) ---
  // Step 2: Maker's suggested content SET — adjustable counts per platform.
  // Counts feed the batch total. This is the "suggests a content set" beat.
  // Asset-mix bundle matched to the launchpad campaign flow (CP_BUNDLE_RULES):
  // LinkedIn 3 posts · Instagram 1 hero + 2 stories · Facebook 2 posts · Email 2.
  const CAMP_SET = [
    { id: 'li', platform: 'LinkedIn', mod: 'text', type: 'LinkedIn posts', count: 3, hint: 'Authority for Maya Holloway' },
    { id: 'ig-image', platform: 'Instagram', mod: 'image', type: 'Hero images', count: 1, hint: 'Aspirational stills for the feed' },
    { id: 'ig-story', platform: 'Instagram', mod: 'image', type: 'Stories', count: 2, hint: 'Ephemeral reach & reminders' },
    { id: 'fb', platform: 'Facebook', mod: 'text', type: 'Facebook posts', count: 2, hint: 'Broad local audience' },
    { id: 'em', platform: 'Email', mod: 'text', type: 'Emails', count: 2, hint: 'Pre-order announcement + reminder' },
  ];

  // Step 5: schedule rows — note the two Instagram pieces on the SAME day (clash).
  const CAMP_SCHEDULE = [
    { title: "It's coming back — Sourdough Saturday", channel: 'Instagram', mod: 'image', day: 'Mon Jun 2', time: '9:00 AM' },
    { title: 'What Millie said after 6 years of loaves', channel: 'Instagram', mod: 'image', day: 'Mon Jun 2', time: '5:00 PM', clash: true },
    { title: 'Why 72-hour cold ferment is worth the wait', channel: 'LinkedIn', mod: 'text', day: 'Tue Jun 3', time: '8:00 AM' },
    { title: 'Pre-orders open — reserve before Friday', channel: 'Email', mod: 'text', day: 'Wed Jun 4', time: '7:00 AM' },
    { title: 'Meet the 4am bakers — a morning POV', channel: 'YouTube', mod: 'video', day: 'Thu Jun 5', time: '12:00 PM' },
    { title: 'The science of a 72-hour crumb', channel: 'LinkedIn', mod: 'text', day: 'Fri Jun 6', time: '8:00 AM' },
  ];

  // --- Per-modality CREATE questions (modeled on the studio modules) ---------
  // Text & Image use one rich brief step; Audio & Video are full step-by-step.

  // Shared voice bank — used by Audio (voice picker) and Video (voiceover).
  const VOICES = [
    { id: 'aria', name: 'Aria', desc: 'Warm narrator · F · en-US' },
    { id: 'deon', name: 'Deon', desc: 'Deep host · M · en-US' },
    { id: 'max', name: 'Max', desc: 'Upbeat promo · M · en-US' },
    { id: 'lila', name: 'Lila', desc: 'Friendly guide · F · en-GB' },
    { id: 'nova', name: 'Nova', desc: 'Gen-Z creator · F · en-US' },
    { id: 'founder', name: 'Founder', desc: 'Your own cloned voice · M · en-US' },
  ];

  // Video AI avatars (presenters) — the client's avatar picker.
  const AVATARS = [
    { id: 'mia', name: 'Mia', role: 'Friendly presenter', accent: 'var(--clr-pillar-audience)' },
    { id: 'theo', name: 'Theo', role: 'Confident spokesperson', accent: 'var(--clr-primary)' },
    { id: 'sana', name: 'Sana', role: 'Warm storyteller', accent: 'var(--clr-image-mod)' },
    { id: 'leo', name: 'Leo', role: 'Energetic creator', accent: 'var(--clr-video-mod)' },
    { id: 'founder', name: 'Your likeness', role: 'Cloned founder avatar', accent: 'var(--clr-audio-mod)' },
  ];

  // Audio goals — each pre-tunes voice / music / pacing (the "80% done for you").
  const AUDIO_GOALS = [
    { id: 'podcast', icon: 'Mic', label: 'Podcast', desc: 'Multi-speaker show with hosts & guests', voice: 'deon', music: 'Soft lo-fi bed', pace: 'Natural (150 wpm)', acoustics: 'Studio (dry)' },
    { id: 'ad', icon: 'Megaphone', label: 'Marketing ad', desc: 'Short, high-energy promo spot', voice: 'max', music: 'Upbeat pop', pace: 'Fast (175 wpm)', acoustics: 'Punchy / bright' },
    { id: 'narration', icon: 'BookOpen', label: 'Narration', desc: 'Audiobook or explainer voiceover', voice: 'aria', music: 'Cinematic ambient', pace: 'Measured (140 wpm)', acoustics: 'Intimate booth' },
    { id: 'elearning', icon: 'GraduationCap', label: 'E-learning', desc: 'Clear, instructional course audio', voice: 'lila', music: 'None', pace: 'Clear (135 wpm)', acoustics: 'Clean / neutral' },
    { id: 'social', icon: 'Smartphone', label: 'Social clip', desc: 'Snappy voiceover for short video', voice: 'nova', music: 'Trending beat', pace: 'Fast (170 wpm)', acoustics: 'Phone-native' },
  ];
  const AUDIO_VIBES = ['Conversational', 'Warm', 'Energetic', 'Confident', 'Calm', 'Authoritative', 'Playful', 'Friendly', 'Bold', 'Trendy'];
  const AUDIO_PRODUCTION = {
    music: ['None', 'Soft lo-fi bed', 'Upbeat pop', 'Cinematic ambient', 'Corporate', 'Trending beat'],
    pace: ['Slow (120 wpm)', 'Clear (135 wpm)', 'Measured (140 wpm)', 'Natural (150 wpm)', 'Fast (170 wpm)', 'Fast (175 wpm)'],
    acoustics: ['Studio (dry)', 'Intimate booth', 'Clean / neutral', 'Punchy / bright', 'Phone-native'],
  };

  // Text brief questions (single rich step).
  const TEXT_BRIEF = {
    angle: { label: 'Topic angle', opts: ['Thought leadership', 'Product launch', 'Promo', 'Community story', 'Educational'] },
    tones: ['Warm', 'Bold', 'Professional', 'Educational', 'Playful'],
    ctas: ['Pre-order now', 'Learn more', 'Reply to this', 'Book a call'],
  };
  // Image brief questions (single rich step).
  const IMAGE_BRIEF = {
    useCase: { label: 'Use case', opts: ['Feed post', 'Story', 'Banner / cover', 'Ad creative', 'Poster / print'] },
    styles: ['Editorial craft', 'Minimal clean', 'Bold promo', 'Documentary / BTS', 'Lifestyle candid'],
  };

  // Video production controls — the look & feel knobs (the client's "animated /
  // cartoonish / professional" controls).
  const VIDEO_CONTROLS = {
    style: ['Professional', 'Cinematic', 'Animated / 2D', 'Cartoonish', '3D animation', 'Motion graphics', 'Live-action', 'Mixed media'],
    pacing: ['Fast cuts', 'Steady narrative', 'Calm / ASMR'],
    hook: ['Bold claim', 'Question', 'Pattern interrupt', 'Stat drop'],
    music: ['Upbeat', 'Cinematic', 'Lo-fi / chill', 'Corporate', 'Trending audio', 'None'],
  };

  // --- Advanced (optional) question sets per modality, behind a disclosure so
  //     novices aren't overwhelmed but specialists get depth. ---
  const ADV = {
    text: {
      length: { label: 'Length', opts: ['Short (~80w)', 'Standard (~150w)', 'Long (~300w)', 'Thread / multi-part'] },
      reading: { label: 'Reading level', opts: ['Casual', 'Professional', 'Expert / technical'] },
      pov: { label: 'Point of view', opts: ['Brand voice (we)', 'Founder (I)', 'Customer (you)'] },
      emoji: { label: 'Emoji', dflt: false },
      keywords: { label: 'SEO keywords', placeholder: 'e.g. sourdough, artisan bakery, pre-order' },
    },
    image: {
      lighting: { label: 'Lighting & mood', opts: ['Warm morning', 'Soft daylight', 'Moody / dramatic', 'Bright studio', 'Golden hour'] },
      composition: { label: 'Composition', opts: ['Close-up / macro', 'Wide scene', 'Flat-lay / top-down', 'Rule-of-thirds', 'Centered hero'] },
      colorDir: { label: 'Color direction', opts: ['Brand palette (locked)', 'Warm earthy', 'Cool & clean', 'High contrast', 'Pastel / muted'] },
      negative: { label: 'Avoid (negative prompt)', placeholder: 'e.g. no text, no people, no clutter' },
    },
    audio: {
      speakers: { label: 'Speakers', opts: ['Single voice', '2 — host + guest', '3 — panel'] },
      intro: { label: 'Intro & outro', dflt: true },
      chapters: { label: 'Chapter markers', dflt: false },
      pronounce: { label: 'Pronunciation guide', placeholder: 'e.g. "Clarity = KLAIR-ih-tee"' },
    },
    video: {
      length: { label: 'Target length', opts: ['15s', '30s', '60s', '90s+'] },
      broll: { label: 'B-roll density', opts: ['Minimal', 'Balanced', 'Heavy / fast'] },
      lowerThirds: { label: 'On-screen text / lower-thirds', dflt: true },
      sting: { label: 'Brand intro sting', dflt: true },
      subtitle: { label: 'Subtitle language', opts: ['English', 'Spanish', 'French', 'None'] },
    },
  };

  // Runtime writer so launched campaigns persist for the session and show in the list.
  function addCampaign(camp) {
    if (!camp || !camp.id) return camp;
    const i = CAMPAIGNS.findIndex(c => c.id === camp.id);
    if (i >= 0) CAMPAIGNS[i] = camp; else CAMPAIGNS.unshift(camp);
    return camp;
  }

  return { ENGINE_STRATEGY, STUDIOS, STUDIO_FLOW, BRIEF, CHANNELS, CHANNEL_MOD, CHANNEL_DESC, GOALS, CAMPAIGNS, addCampaign, SERIES, CAMP_PLAN, CAMP_BATCH, CAMP_SERIES_PLAN, CAMP_SET, CAMP_SCHEDULE, PILLARS, CLARA_GOAL, PROFILE,
    VOICES, AVATARS, AUDIO_GOALS, AUDIO_VIBES, AUDIO_PRODUCTION, TEXT_BRIEF, IMAGE_BRIEF, VIDEO_CONTROLS, ADV };
})();
