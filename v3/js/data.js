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

  // --- Studio Create flow (mirrors the source mockups: GTM → lock → generate →
  // preview → publish). The idea/persona/market are inherited, so the flow opens
  // straight on Go-to-Market with an AI-picked platform. Per-modality so each
  // studio shows the right platforms, specs and variation angles. ---
  const STUDIO_FLOW = {
    text: {
      platforms: [
        { type: 'email', icon: 'Mail', label: 'Email', rec: true, reason: 'a pre-order push converts best in the inbox — owned audience, no algorithm.' },
        { type: 'linkedin', icon: 'Briefcase', label: 'LinkedIn post', reason: '' },
        { type: 'blog', icon: 'FileText', label: 'Blog / SEO', reason: '' },
        { type: 'ig-caption', icon: 'Image', label: 'Instagram caption', reason: '' },
        { type: 'x', icon: 'Hash', label: 'X / Thread', reason: '' },
      ],
      specs: [
        { key: 'length', label: 'Length', opts: ['Short (~80 words)', 'Standard (~150 words)', 'Long-form (~400 words)'] },
        { key: 'tone', label: 'Tone', opts: ['Warm & personal', 'Confident & direct', 'Playful', 'Editorial'] },
        { key: 'cta', label: 'Call to action', opts: ['Pre-order now', 'Learn more', 'Reply to this', 'None'] },
      ],
      angles: [
        { angle: 'Story-led open', desc: 'Opens on Millie\'s six years of loaves, then lands the pre-order ask.', fit: 91 },
        { angle: 'Proof-first', desc: 'Leads with the 72-hour cold ferment as the reason to trust the craft.', fit: 86 },
        { angle: 'Scarcity nudge', desc: 'Friday cut-off up top, warm sign-off — urgency without the hard sell.', fit: 83 },
      ],
    },
    image: {
      platforms: [
        { type: 'ig-feed', icon: 'Image', label: 'Instagram Feed', rec: true, reason: 'a visual, craft-led product — the feed rewards beautiful, aspirational stills.' },
        { type: 'ig-story', icon: 'Smartphone', label: 'Instagram Story', reason: '' },
        { type: 'poster', icon: 'Frame', label: 'Poster / Print', reason: '' },
        { type: 'fb-ad', icon: 'Megaphone', label: 'Facebook Ad', reason: '' },
        { type: 'pinterest', icon: 'Pin', label: 'Pinterest Pin', reason: '' },
      ],
      specs: [
        { key: 'ratio', label: 'Aspect ratio', opts: ['1:1 (Square)', '4:5 (Portrait)', '9:16 (Story)', '16:9 (Landscape)'] },
        { key: 'style', label: 'Visual style', opts: ['Warm editorial photo', 'Flat-lay', 'Bold typographic', 'Lifestyle candid'] },
        { key: 'mood', label: 'Mood', opts: ['Golden / warm', 'Clean / bright', 'Moody / artisanal'] },
      ],
      angles: [
        { angle: 'Hero loaf close-up', desc: 'Steam, crust and golden light — the crumb shot that stops the scroll.', fit: 90 },
        { angle: 'Hands in flour', desc: 'The 4am craft moment, warm and human, brand mark bottom-right.', fit: 87 },
        { angle: 'Typographic announce', desc: '"Sourdough Saturday is back" set over a soft-focus bakery shelf.', fit: 82 },
      ],
    },
    video: {
      platforms: [
        { type: 'ig-reel', icon: 'Film', label: 'Instagram Reel', rec: true, reason: 'a visual, lifestyle product — Reels rewards aspirational short-form video.' },
        { type: 'yt-short', icon: 'Play', label: 'YouTube Short', reason: '' },
        { type: 'tiktok', icon: 'Music', label: 'TikTok', reason: '' },
        { type: 'linkedin', icon: 'Briefcase', label: 'LinkedIn Video', reason: '' },
        { type: 'yt-long', icon: 'MonitorPlay', label: 'YouTube Long', reason: '' },
      ],
      specs: [
        { key: 'ratio', label: 'Aspect ratio', opts: ['9:16 (Vertical)', '16:9 (Landscape)', '1:1 (Square)', '4:5 (Portrait)'] },
        { key: 'res', label: 'Resolution', opts: ['1080 x 1920', '1080 x 1080', '1920 x 1080', '3840 x 2160 (4K)'] },
        { key: 'type', label: 'Content type', opts: ['Live-action film', 'Motion graphics', 'Talking-head / UGC', 'Stop-motion'] },
      ],
      angles: [
        { angle: 'Hook-first cut', desc: 'Opens on the boldest claim, then proves it in three fast beats.', fit: 90 },
        { angle: 'Story-driven cut', desc: 'Follows Millie from the problem straight to the payoff.', fit: 86 },
        { angle: 'Founder UGC cut', desc: 'Raw, talking-to-camera energy that reads authentic, not an ad.', fit: 83 },
      ],
    },
    audio: {
      platforms: [
        { type: 'podcast', icon: 'Mic', label: 'Podcast episode', rec: true, reason: 'long-form trust-building — your loyalists listen on the commute.' },
        { type: 'voiceover', icon: 'Volume2', label: 'Voiceover', reason: '' },
        { type: 'audio-ad', icon: 'Radio', label: 'Audio ad', reason: '' },
        { type: 'spotify', icon: 'Headphones', label: 'Spotify / Music', reason: '' },
      ],
      specs: [
        { key: 'length', label: 'Length', opts: ['15s spot', '30s spot', '2–3 min segment', 'Full episode'] },
        { key: 'voice', label: 'Voice', opts: ['Warm female', 'Warm male', 'Founder voice', 'Neutral narrator'] },
        { key: 'music', label: 'Music bed', opts: ['Acoustic / warm', 'Upbeat', 'Ambient', 'None'] },
      ],
      angles: [
        { angle: 'Narrative spot', desc: 'A 30-second story arc from first loaf to loyal regular.', fit: 89 },
        { angle: 'Founder note', desc: 'Owner-to-listener, intimate and unpolished — pure trust.', fit: 85 },
        { angle: 'Sensory tease', desc: 'Leads on sound design — crackling crust, then the pre-order line.', fit: 81 },
      ],
    },
  };

  const CHANNELS = ['Instagram', 'LinkedIn', 'TikTok', 'Email', 'YouTube'];
  const CHANNEL_MOD = { Instagram: 'image', LinkedIn: 'text', TikTok: 'video', Email: 'text', YouTube: 'video' };

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
    { title: 'Meet the 4am bakers — a morning POV', channel: 'TikTok', mod: 'video', pf: 79, series: 'bts' },
    { title: 'The science of a 72-hour crumb', channel: 'LinkedIn', mod: 'text', pf: 90, series: 'patience' },
  ];

  // Advanced-mode series plan — what Maker proposes when the user has "several ideas
  // at once". A campaign = multiple series in parallel. Counts here sum to CAMP_BATCH.
  const CAMP_SERIES_PLAN = [
    { id: 'launch', name: 'Sourdough Saturday Launch', pattern: 'Launch Countdown', posts: 3, mods: ['image', 'text'], hint: 'Build anticipation to the Friday cut-off' },
    { id: 'bts', name: 'Meet the 4am Bakers', pattern: 'Behind-the-Scenes', posts: 1, mods: ['video'], hint: 'Trust through transparency' },
    { id: 'patience', name: 'Why Patience Wins', pattern: 'Educational Ladder', posts: 2, mods: ['text'], hint: 'Authority for The Artisan Loyalist' },
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
  const CAMP_SET = [
    { id: 'ig', platform: 'Instagram', mod: 'image', type: 'Feed + Story', count: 3, hint: 'Carousels & stories for reach' },
    { id: 'li', platform: 'LinkedIn', mod: 'text', type: 'Thought-leadership post', count: 2, hint: 'Authority for The Artisan Loyalist' },
    { id: 'em', platform: 'Email', mod: 'text', type: 'Broadcast', count: 2, hint: 'Pre-order announcement + reminder' },
    { id: 'tt', platform: 'TikTok', mod: 'video', type: 'Short-form reel', count: 2, hint: 'Behind-the-craft POV' },
  ];

  // Step 5: schedule rows — note the two Instagram pieces on the SAME day (clash).
  const CAMP_SCHEDULE = [
    { title: "It's coming back — Sourdough Saturday", channel: 'Instagram', mod: 'image', day: 'Mon Jun 2', time: '9:00 AM' },
    { title: 'What Millie said after 6 years of loaves', channel: 'Instagram', mod: 'image', day: 'Mon Jun 2', time: '5:00 PM', clash: true },
    { title: 'Why 72-hour cold ferment is worth the wait', channel: 'LinkedIn', mod: 'text', day: 'Tue Jun 3', time: '8:00 AM' },
    { title: 'Pre-orders open — reserve before Friday', channel: 'Email', mod: 'text', day: 'Wed Jun 4', time: '7:00 AM' },
    { title: 'Meet the 4am bakers — a morning POV', channel: 'TikTok', mod: 'video', day: 'Thu Jun 5', time: '12:00 PM' },
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

  return { ENGINE_STRATEGY, STUDIOS, STUDIO_FLOW, CHANNELS, CHANNEL_MOD, GOALS, CAMPAIGNS, SERIES, CAMP_PLAN, CAMP_BATCH, CAMP_SERIES_PLAN, CAMP_SET, CAMP_SCHEDULE, PILLARS, CLARA_GOAL, PROFILE,
    VOICES, AVATARS, AUDIO_GOALS, AUDIO_VIBES, AUDIO_PRODUCTION, TEXT_BRIEF, IMAGE_BRIEF, VIDEO_CONTROLS, ADV };
})();
