/* persona-grounded.js — idea-grounded persona dialogue sets. persona.js prefers a set whose
   `match` keywords appear in the idea offer, else falls back to the generic archetype banks.
   (In production these are LLM-generated per idea; here they are pre-authored for demo ideas.) */
window.ClarityPersonaGrounded = [
  {
    "match": [
      "engine",
      "f1",
      "formula",
      "motorsport",
      "powertrain",
      "racing",
      "race"
    ],
    "label": "Racing engine",
    "scripts": {
      "risk-reducer": {
        "greeting": "Before we talk power figures, tell me one thing: has this engine ever finished a full season without a single one of them letting go?",
        "confession": "Here's the truth I don't say in the paddock: I've got a driver, a title sponsor, and eighteen people whose mortgages ride on my judgment, and I lie awake picturing your engine throwing a rod on lap forty of the season opener with the whole grid watching. I'm not buying horsepower. I'm buying the promise that I never have to make that phone call.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — the number that scares me isn't your peak horsepower, it's the one time in ten your engine won't see the checkered flag.",
            "guarded": "You're new. I have no season-long reliability data on your engine, and I don't hand a rookie supplier my championship.",
            "warm": "The barrier is the blank page next to your name — no mean-time-between-failures I can trust, no other principal I can call who's run your engine hard for a full endurance season. A grenade at Sebring doesn't just cost me a race, it costs me next year's sponsor.",
            "candid": "Honestly? I could live with you being five horsepower down on the established unit. What stops me cold is that I can't yet put a number on how often your engine lets go under real load — and until I can model that failure rate into a season, buying yours is me gambling my whole program on faith, and I stopped gambling with other people's money a long time ago."
          },
          "current": {
            "fragment": "Now you know — my current engine isn't better than yours, it's just the devil whose rebuild interval I already have memorized.",
            "guarded": "I lease sealed units from an established builder and run them within their homologation window. It works.",
            "warm": "Right now I take a proven spec engine on a lease-and-rebuild deal — known power curve, known 4,000-kilometer rebuild interval, a builder who's been on grids for fifteen years. It's not the sharpest tool, but I can plan a season around it and my chassis is already mapped to its torque delivery.",
            "candid": "The real reason I stay is boring and it's everything: when a unit lets go at a night race, their truck is already in the paddock with a spare and an engineer who knows my data. I'm not paying that incumbent for peak power — I'm paying for the fact that I've never once been stranded, and switching means giving up a support network I spent a decade building."
          },
          "switch": {
            "fragment": "Now you know — I'll switch the day your engine's reliability stops being a story and starts being a spreadsheet.",
            "guarded": "Show me a full season of race finishes on someone else's car before you show me a dyno sheet.",
            "warm": "Give me durability data I can audit — dyno hours at full song, teardown reports at the rebuild interval, and two team principals I can phone who've run your engine a whole season. Match my current power, beat me on rebuild cost, and put your engineer trackside, and now we're talking.",
            "candid": "What actually flips me is risk moving off my balance sheet onto yours: a written reliability guarantee with a failure-replacement clause, a guaranteed spares pool warehoused this side of the Atlantic, and skin in the game — you eat the cost if your engine grenades from a build fault mid-season. Do that and I don't even need you to be the most powerful engine on the grid; I need you to be the one I never have to worry about."
          },
          "price": {
            "fragment": "Now you know — I don't flinch at the sticker, I flinch at the cost-per-race-finished nobody prints on the invoice.",
            "guarded": "I'll talk numbers once I see the reliability data. Not before.",
            "warm": "I think in cost-per-season, not sticker price — lease plus rebuilds plus spares. I'll pay a real premium over my current unit, but only if the total landed cost across a championship, including the finishes I don't lose, comes out ahead.",
            "candid": "Look, for a bespoke race engine I know I'm in the mid-six figures per unit before rebuilds, and I'll pay it — but every dollar of that premium has to buy down risk, not just add horsepower. Honestly I'd pay more for your engine than the incumbent if the deal includes the reliability guarantee and the spares pool, because a blown budget I can explain to my sponsor; a DNF in the season finale I cannot."
          },
          "committee": {
            "fragment": "Now you know — I can say yes to the engine, but three other people can quietly say no.",
            "guarded": "It's not just me. My technical director and the money have to be comfortable too.",
            "warm": "My technical director has to sign off that your engine integrates with our chassis and cooling, our commercial lead has to fit it in the budget, and the title sponsor gets nervous about anything unproven wearing their name. I run the room, but any one of them can stall it.",
            "candid": "The real decision-maker in the room is the fear of a public failure. My TD will nitpick the mounting points and the ECU integration, my owner will squeeze the number — but the person who truly has veto is the sponsor who imagines their logo on the car that grenaded on the grid. Win their confidence with your reliability story and references, and I can carry the rest of the room myself."
          },
          "regret": {
            "fragment": "Now you know — I bought raw pace once and it cost me a season, a sponsor, and a good night's sleep.",
            "guarded": "I bought on power once and got burned. Let's just say I read the reliability data now.",
            "warm": "A few seasons back I switched to an engine that was clearly quickest on the dyno — biggest peak number in the field. Then it started letting go under sustained load; we DNF'd out of three races and I spent the summer apologizing to people who trusted me.",
            "candid": "The one that still stings: we chased a bespoke high-output build from a supplier with no season-long track record, seduced by the horsepower and a slick pitch. It grenaded twice before mid-season, torched the championship, and the sponsor walked at year-end. That engine taught me the most expensive lesson in this sport — the fastest engine that doesn't finish is worth less than nothing, and that's exactly why I'm sitting here interrogating you instead of reading your dyno sheet."
          }
        }
      },
      "performance": {
        "greeting": "Before we talk price, show me the dyno sheet — I want the full-power curve, not the peak number you put on the brochure.",
        "confession": "The truth I don't say out loud: I've had a car that was two tenths a lap quicker on paper and I still lost the championship because the engine let go at Sebring with forty minutes left. So when I push you this hard on reliability, it's because outright power has broken my heart before — I want the edge, but I've learned the hard way that a fast engine I can't finish a season on is worthless to me, and admitting that fear to a supplier feels like handing you leverage.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — the thing stopping me isn't the horsepower claim, it's that I can't yet prove it survives a full stint.",
            "guarded": "I don't have your data. Until I see a real dyno pull and a back-to-back on track, you're just another number on a spreadsheet.",
            "warm": "The barrier is trust in the numbers. Anyone can quote 620 horsepower on a fresh build; I need to see the curve after twelve heat cycles and a 30-hour endurance run, because that's where most 'F1-grade' engines quietly fall off a cliff.",
            "candid": "Honestly? It's the unknown between your dyno cell and my gearbox. A bespoke engine I can't validate is a season-ending gamble — if it makes 40 more horsepower but drops a valve at hour six of a 24, I've burned my budget, my grid slot, and my driver's confidence, and no lap-time gain buys that back."
          },
          "current": {
            "fragment": "Now you know — right now I'm cobbling together an edge from a spec engine and a tuner who won't tell me what's inside.",
            "guarded": "We run what the series homologates and rebuild it on the mandated interval. It works. It's not exciting.",
            "warm": "Today I lease a sealed spec unit from the series-approved supplier, roughly 600 horse, and we live inside the regs. The frustration is I can't touch the map or the internals, so everyone in the field has the exact same engine and we're all fighting over aero and tire management for tenths.",
            "candid": "The real picture: I've got one homologated engine builder in the Midwest doing my rebuilds every 4,000 kilometers, a dyno day I beg for twice a season, and a data set I don't fully own. I'm extracting maybe 95 percent of what's there and I know it, and it eats at me every time a competitor finds pace I can't explain."
          },
          "switch": {
            "fragment": "Now you know — I'll switch the day your engine gives me a repeatable, legal tenth I can't find anywhere else.",
            "guarded": "Give me lap time. Prove it's faster back-to-back on the same day, same tires, same driver — then we talk.",
            "warm": "What flips me is a genuine, homologation-legal advantage I can measure: broader torque out of slow corners so my driver gets on throttle earlier, or the same power at 8 kilos lighter. Show me that on a track we both know, say Road America or Watkins Glen, and I'm listening hard.",
            "candid": "I switch when you hand me an edge and the confidence to lean on it: back-to-back track data showing three-plus tenths a lap, a torque curve that's driveable enough my driver stops fighting the car mid-corner, a rebuild interval that doesn't blow my operating budget, and spares I can get overnight anywhere in North America. Nail all four and I'll move my whole program to you — the performance is the hook, but the support is what closes me."
          },
          "price": {
            "fragment": "Now you know — I'll pay stupid money for real pace, but only pace I can prove and repeat.",
            "guarded": "Depends entirely on the gain. Give me a number when you can back it with data.",
            "warm": "For a genuine lap-time edge I'm not squeezing you on the sticker — I'll pay a real premium over the spec unit, maybe two to three times, if the performance is there and the thing lasts a season. What I won't pay for is a dyno queen that's fast for one weekend.",
            "candid": "Straight up: a bespoke top-tier build, call it 180 to 250 thousand a unit, is fine by me if it earns podiums — but I price it on cost-per-race-finished, not the invoice. I need the rebuild interval, spares, and support folded in, because a cheaper engine that grenades twice a year and strands me without parts is the most expensive thing on the trailer. Show me the total season cost and a proven edge, and money is genuinely my last question."
          },
          "committee": {
            "fragment": "Now you know — I drive the engine call, but I don't sign the check alone.",
            "guarded": "It's not just me. The team owner and the money have to say yes.",
            "warm": "I'm the one who says 'this engine is faster and I trust it,' but the team principal signs off on the budget and our commercial partners care about results and reliability for the sponsors. My crew chief also gets a hard vote — if he can't service it trackside, it doesn't matter how fast it is.",
            "candid": "The real room: I make the performance case with the dyno and track data, the owner weighs it against the season budget, the title sponsor wants championship-relevant results not science projects, and my lead engine tech has veto power on serviceability and spares logistics. You win me on the numbers, but you have to survive all four — so bring data for me, a cost-per-season story for the owner, and a support-and-spares plan for my tech, or the deal stalls above my head."
          },
          "regret": {
            "fragment": "Now you know — I once bought horsepower on a promise and it cost me a championship.",
            "guarded": "I've been burned buying peak numbers off a dyno sheet. Lesson learned.",
            "warm": "A few seasons back I bought a hot-vee build from a boutique shop chasing 30 extra horses. Fast on the dyno, brutal on track — the power came in so peaky my driver couldn't put it down out of slow corners, and we actually lost lap time where it mattered. Paid a premium to go slower.",
            "candid": "The one that still stings: a bespoke engine sold on a monster peak number and a handshake about durability. It made the power, but the rebuild interval was half what they claimed, we had a bottom-end failure while leading at Petit Le Mans, and their nearest support was a plane ride away with a two-week parts lead time. I lost the title in the last hour of the season to a slower car that simply finished — that day taught me I buy proven, driveable, supportable pace, never a brochure figure."
          }
        }
      },
      "cost": {
        "greeting": "Before we talk horsepower — what does one of your engines actually cost me per race weekend, all-in?",
        "confession": "Honest truth I'd never say in the paddock: I'm running a tired spec motor that's two rebuilds past where it should be, and I gamble every endurance round that the bottom end holds. I can't afford your engine at sticker, but I also can't afford another grenaded block — I'm one blown motor away from folding the team, and nobody out here knows how thin the budget really is.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — it's never the power number that scares me, it's the invoice that lands after the power number.",
            "guarded": "Price, plainly. Your dyno sheet looks great, but I run this whole team out of one trailer.",
            "warm": "It's total cost of ownership, not the sticker. A bespoke build with a short rebuild interval and factory-priced spares will bleed me dry over a full season no matter how much horsepower it makes.",
            "candid": "The real barrier is I can't survive a surprise. If your engine's 28 grand a rebuild every 3,000 miles and I'm doing eight rounds plus test days, that number ends my season by August — I need cost-per-race locked before I care about a single extra horsepower or a tenth of a lap."
          },
          "current": {
            "fragment": "Now you know — my engine program is held together with used parts and paddock favors.",
            "guarded": "I buy second-hand crate motors and get them freshened by an independent builder I trust.",
            "warm": "Right now I run ex-team engines a season or two old, stretch them past the recommended rebuild interval, and lean on a local shop that does my top-ends for a fraction of the factory rate.",
            "candid": "Honestly? It's a spec motor I bought used two years back, I've run it way past its rebuild spec to save cash, and I roll the dice every endurance race that it holds together. My whole 'strategy' is deferring the rebuild until something lets go on track — which is a terrible plan and I know it."
          },
          "switch": {
            "fragment": "Now you know — I'll switch suppliers the second the math says I save a rebuild.",
            "guarded": "Show me it's cheaper to run over a season and I'll listen.",
            "warm": "A longer rebuild interval is what moves me — if your engine goes 5,000 miles between freshen-ups instead of 3,000, and spares are on the shelf in North America, that's real money back in my budget every round.",
            "candid": "I switch the day you prove lower cost-per-race: a documented rebuild interval I can trust, a fixed-price rebuild I can plan around, spares I can get in 48 hours without air-freighting from overseas, and it bolts to my existing chassis and gearbox without a redesign. Do that and I don't care whose badge is on the cam cover."
          },
          "price": {
            "fragment": "Now you know — the number I'll say out loud and the number that actually works are two different numbers.",
            "guarded": "Less than what the factory teams pay. I'm not in that bracket.",
            "warm": "I can stomach maybe 45 to 55 grand for the engine if the running costs are sane — but the sticker matters less than the rebuild bill and spares pricing over a season.",
            "candid": "Truthfully, cash up front I can find maybe 40 grand, and even that hurts. What I actually need is a lease or a cost-per-mile deal — give me a fixed number per race weekend that covers the engine and the rebuilds, and I'll happily pay a bit more overall just to never get ambushed by a 30k invoice mid-season."
          },
          "committee": {
            "fragment": "Now you know — the 'committee' is me, my number one mechanic, and whoever's still willing to sponsor us.",
            "guarded": "I make the call. It's a small team.",
            "warm": "It's really me and my lead engineer — he has to be convinced it's reliable and easy to work on, because he's the one rebuilding it at 2am between rounds.",
            "candid": "On paper I decide everything, but the truth is my title sponsor's check has to clear first and my crew chief has veto — if he says your engine's a nightmare to service in the paddock or the parts never show up, it doesn't matter what the dyno says, we're not buying it."
          },
          "regret": {
            "fragment": "Now you know — I've been burned before, and I paid for it in DNFs, not just dollars.",
            "guarded": "Bought a 'bargain' engine once that turned out to be anything but. Lesson learned.",
            "warm": "I once chased a cheap ex-works motor that looked like a steal — but the spares were unobtainable in North America and every part had to come from overseas, so it sat in the truck half the season.",
            "candid": "The one that still stings: I bought a used prototype engine off a folding team for cheap, no service history, and it let go on lap four of our biggest endurance round — took out the whole weekend's entry fee, my sponsor's confidence, and two months of budget I didn't have. That's exactly why I now grill every supplier about rebuild intervals and parts availability before I ever look at the horsepower."
          }
        }
      },
      "status": {
        "greeting": "Look, I've won championships with engines nobody's heard of — so tell me why my sponsors should see your badge on my car.",
        "confession": "Here's the truth I'd never say into a microphone: half of what I'm buying is optics. My title sponsor renews because we look like winners and we sit at the right table in the paddock — so when I buy an engine, I'm really buying a story I can sell in the hospitality suite. If your name makes my drivers proud to sign and my backers proud to write the check, I'll pay a premium and pretend it was purely about the dyno numbers.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — the horsepower doesn't scare me, the anonymity does.",
            "guarded": "You're an unknown name, and I'm not putting an unproven badge on a car my sponsors pay to be seen on.",
            "warm": "The real hold-up is provenance — I need your engine to have a paddock reputation before I stake my season and my brand on it, because a private dyno sheet doesn't impress the people in my hospitality suite.",
            "candid": "Honestly, my barrier is that nobody at the sponsor table has heard of you yet — I could live with a slightly softer torque curve, but I can't live with a title backer asking why we're running a motor they can't Google and feel proud of."
          },
          "current": {
            "fragment": "Now you know — I buy the logo as much as the long block.",
            "guarded": "We run a customer program from an established marque — sealed spec engines, homologated for the series, delivered on a schedule.",
            "warm": "Right now I lease from a name-brand supplier because the emblem carries weight; the units are good for a full season on two rebuilds, but I'm paying as much for their crest on my cam cover as for the power.",
            "candid": "Today I take the marquee customer deal even when the numbers aren't the sharpest on the grid, because when I walk a sponsor through the garage, 'that's a factory-supported motor' closes the renewal — the day their badge stops opening checkbooks is the day I'd leave them."
          },
          "switch": {
            "fragment": "Now you know — give me a name to drop and a trophy to point at, and I'm listening.",
            "guarded": "Show me you've won something visible — a podium in a series people watch — and then we can talk.",
            "warm": "I'd switch if your engine came with a story I can sell: a factory works program, a marquee win, a name my drivers brag about and my sponsors want their logo next to on the airbox.",
            "candid": "Put your engine in a car that wins a race the cameras are on, hand me the badge rights and a paddock-facing partnership I can announce with my title sponsor, and I'll switch mid-season — cachet plus a championship-capable package is the only thing that moves me faster than loyalty."
          },
          "price": {
            "fragment": "Now you know — I'll overpay for prestige and haggle hard on plumbing.",
            "guarded": "Depends on the package — a competitive customer season runs deep into six figures per car, and I don't buy cheap engines.",
            "warm": "For a full-season lease with spares and trackside support across North America I'm used to seven figures a car; I'll pay at the top of that band if the name is right.",
            "candid": "Truthfully, I'll pay a 20 to 30 percent premium over a faster no-name unit if your badge lets me upsell a sponsor tier — the engine that makes my hospitality suite feel like a winning team is worth more to me than the one that's a tenth quicker but invisible."
          },
          "committee": {
            "fragment": "Now you know — I sign it, but my sponsor's logo has a vote.",
            "guarded": "It's my call as principal, but the commercial side weighs in.",
            "warm": "On paper it's me and my technical director, but really my title sponsor and my lead driver shape it — the sponsor wants a name that flatters their brand, the driver wants a motor he trusts to win.",
            "candid": "The honest org chart is: my TD vets the dyno and reliability numbers, but my title sponsor's marketing people quietly hold the veto — if your engine doesn't make their brand look like it's backing a winner, and if my star driver won't put his name to it, the deal dies no matter how good the horsepower is."
          },
          "regret": {
            "fragment": "Now you know — I once bought the badge and it bought me nothing but a bill.",
            "guarded": "I bought a big-name package once that didn't deliver on track — expensive lesson.",
            "warm": "I chased a prestige supplier's engine purely for the emblem, and it grenaded twice before mid-season — the name was gold in the brochure but we DNF'd in front of the very sponsors I bought it to impress.",
            "candid": "My worst buy was a marquee-badged motor I took for the paddock optics — I ignored the thin rebuild interval and weak North American spares support, and when it let go on lap forty with my title sponsor watching from my box, I learned that a prestigious name that can't finish the race costs you far more cachet than it ever bought."
          }
        }
      },
      "convenience": {
        "greeting": "Look, I'll be blunt — I don't need a science project, I need a crate that lands on my dock, bolts into the tub, and fires on the first crank.",
        "confession": "The honest truth? I'm running a two-engineer shop doing the work of six, and my whole season hangs on nobody quitting and nothing grenading — if your engine means I'm no longer the single point of failure at 2 a.m. before a race, I'll fight my owner to sign it.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — a new engine that needs babysitting is worse to me than no engine at all.",
            "guarded": "The bandwidth. I can't spare an engineer for six months to sort out somebody's brand-new motor.",
            "warm": "It's the integration risk that scares me — new engine mounts, a wiring harness that doesn't match my loom, an ECU I have to learn, cooling I have to re-package. Every one of those is time I don't have.",
            "candid": "Honestly, the real barrier is being your test mule — an unproven engine, no support depot within a thousand miles, and my season riding on it. If it lets go at Sebring and your nearest tech is on a plane, I'm done, sponsors and all."
          },
          "current": {
            "fragment": "Now you know — right now I'm just renting reliability from somebody else and paying through the nose for it.",
            "guarded": "We lease sealed units from an established builder and ship them back at the rebuild interval. It works, mostly.",
            "warm": "We run sealed spec engines on a lease — around 30 hours between rebuilds, freight both ways, and we're just one account of many. When something's off, we join the queue behind the factory teams.",
            "candid": "The truth is I'm a small fish to my current builder — I've waited three weeks for a rebuild in-season, been handed a down-on-power unit because the fresh ones went to the works cars, and eaten the freight every time. I'm not buying horsepower from them, I'm buying not-having-to-think-about-it, and even that they get wrong."
          },
          "switch": {
            "fragment": "Now you know — I'll switch for the support before I'll switch for the horsepower.",
            "guarded": "Make it genuinely turnkey and give me a number a human actually answers. Then we talk.",
            "warm": "A crate engine with a harness that plugs into my chassis loom, a proven base ECU map, mounting that fits a common bellhousing, and a spares kit on the shelf — that gets my attention more than another 40 horsepower.",
            "candid": "What actually moves me: a named support engineer for the region, a loaner engine so a rebuild never costs me a session, guaranteed five-day turnaround, and spares stocked somewhere I can reach overnight in North America. Give me that and I'll switch even if you're ten horsepower down on the dyno — because I'll finish races the other guys won't."
          },
          "price": {
            "fragment": "Now you know — I don't price the engine, I price the whole season it has to survive.",
            "guarded": "Depends what's wrapped around it. A cheap engine with no support isn't cheap.",
            "warm": "I think in cost-per-season, not sticker — I can carry something in the low-to-mid six figures a year if that includes rebuilds, spares, and support, but a bare quarter-million crate with a rebuild bill stacked on top is a hard no.",
            "candid": "Realistically my board will approve maybe 250 to 350k a year all-in per car if it's turnkey — buy or lease, I don't care, I care about the fully-loaded number and predictable rebuild costs. Surprise me with a 60k top-end I didn't budget and it doesn't matter how fast it is, I can't run it."
          },
          "committee": {
            "fragment": "Now you know — I can champion it, but I can't sign it alone.",
            "guarded": "It's not just my call. There's an owner and an engineer above and beside me.",
            "warm": "The team owner signs the check, my chief engineer has to bless the integration and reliability, and the title sponsor cares that it wins — I'm the one who has to line all three up.",
            "candid": "Here's the real dynamic: my owner only hears the annual number, my chief engineer has a quiet veto because he's the one who lives with the install, and the sponsor wants podiums for the logo. My job is to bring them a package so buttoned-up nobody can say no — which is exactly why turnkey matters so much to me."
          },
          "regret": {
            "fragment": "Now you know — the cheapest engine I ever bought cost me a whole championship.",
            "guarded": "I bought a bargain motor once off a folding team. Never again.",
            "warm": "We picked up a pair of ex-works engines cheap from a team that shut down — great dyno sheet, no paperwork, no support. Looked like a steal until the first one needed anything.",
            "candid": "One of them dropped a valve at the halfway round and there was nobody to call — no spares, no build history, no rebuild support, just a very expensive paperweight in my trailer. We missed two races, lost the points lead and a sponsor renewal, and I learned the hard way that a bargain with no support behind it is the most expensive thing in this paddock."
          }
        }
      },
      "community": {
        "greeting": "Look, before we talk horsepower — tell me who's actually behind this engine, because I don't buy metal, I buy the people who build it.",
        "confession": "Truth is, I've turned down engines that were faster on the dyno because the outfit selling them treated my crew like a purchase order number. I've been in this paddock thirty years — I've buried friends who raced, I've slept in the transporter at Sebring — and I can't hand my season to a supplier who wouldn't recognize my chief mechanic's name. I'm scared that chasing the story over the stopwatch is going to cost me a championship one day, but I still can't make myself do it any other way.",
        "intents": {
          "barrier": {
            "fragment": "Now you know — I'm not stalling on the spec sheet, I'm waiting to see if you'll still pick up the phone at 2am at Road America.",
            "guarded": "I don't know your people yet, and I've never seen your truck in the paddock. That's the thing stopping me, not the horsepower.",
            "warm": "The barrier is trust in the long game — an F1-grade unit is a full-season commitment, and I've been burned by builders who were all handshakes at the launch and voicemail by round four. Show me you'll be at the endurance rounds with a spares trailer and an engineer who knows my car.",
            "candid": "Honestly? The biggest thing stopping me is that you're new to this community and I can't yet vouch for you to the other privateers who'll ask me who I'm running. If your program folds mid-season or you get bought out, I'm the one stranded on a grid with a bespoke block nobody else can rebuild, and my whole reputation in this paddock rides on whose name is on my engine cover."
          },
          "current": {
            "fragment": "Now you know — my current engine isn't just a supplier, it's a twenty-year friendship I'm terrified to walk away from.",
            "guarded": "I run a builder I've used for years. He knows my cars, and I know his handshake's good.",
            "warm": "Right now I lease sealed units from a small shop out of Indianapolis — same family-run outfit since my father raced. They're not the last word on peak power, but they show up at every round, they rebuild on a known interval, and they've never once left me stranded in the gravel.",
            "candid": "Today I get my engines the way I've gotten everything in this sport — through relationships. It's a spec-derived build from a shop where the owner comes trackside himself, hands me the dyno sheet in person, and remembers my daughter's name. I pay a loyalty premium for maybe fifteen, twenty horses less than the sharp-elbowed outfits, because when I blow a motor at Watkins Glen on a Sunday, he's on a plane Monday. That's not a transaction, that's family, and that's the bar you're up against."
          },
          "switch": {
            "fragment": "Now you know — you don't win me with a lap time, you win me by earning a place in the paddock family.",
            "guarded": "You'd have to prove you actually belong here first. Numbers alone won't move me.",
            "warm": "I'd switch if I saw you genuinely investing in the racing community — supporting the club series, hiring people who've turned wrenches, being at the tests when there's nothing to sell. Match my current reliability and rebuild interval, and then it becomes about whether your people race for the love of it like mine do.",
            "candid": "What flips me is watching you support the paddock when there's no order on the table — sponsoring a young privateer nobody's heard of, standing in the rain at a regional round, backing the historic classes that don't make you a dime. Give me that, plus a real North American spares network and an engineer I can call by first name, and I'll switch even if you're only dead-level on power — because I'm buying into a story and a community I want my program to be part of for the next decade."
          },
          "price": {
            "fragment": "Now you know — I'll pay a premium for loyalty, but only to people who've proven they've earned it.",
            "guarded": "I'll pay a fair number for the engine, but I'm not chasing the flashiest badge just to overspend.",
            "warm": "For a season lease with rebuilds and trackside support, I'm comfortable in the range I pay now — call it well into six figures across a campaign — and I'll happily pay a premium over the cheapest option for a supplier who shares the passion. What I won't do is get gouged by an outfit that treats me like a corporate account.",
            "candid": "I'll pay maybe ten, fifteen percent over the coldest, cheapest bespoke build in the market — real money, the kind that keeps me up at night as a privateer — but only if that premium buys me the relationship: the founder trackside, guaranteed rebuild intervals, spares I can actually get in North America, and the sense that we're building something together. Undercut everyone on price and I'll actually trust you less, because in this community cheap usually means you're about to disappear."
          },
          "committee": {
            "fragment": "Now you know — the real veto in my program isn't the money guy, it's the crew chief who's bled for this team.",
            "guarded": "It's not just me. A few people I trust have to be comfortable before I commit.",
            "warm": "My crew chief and my lead engine man have real say — they're the ones who'll live with your unit at 3am in the paddock. My backers matter for the check, but honestly the crew's opinion carries more weight, because loyalty inside my team is the whole reason we've lasted.",
            "candid": "On paper it's me and my two co-owners who sign, but the true decision-makers are my crew chief of eighteen years and the old engine builder I still call for advice — if either of them says your people don't feel right, the deal's dead no matter what the dyno says. And there's an unofficial committee too: the other privateers and the paddock elders whose respect I'd lose if I signed with an outfit that didn't honor the racing community. I answer to all of them."
          },
          "regret": {
            "fragment": "Now you know — the purchase I regret most wasn't the slowest one, it was the one that made me feel like a stranger to people I'd trusted.",
            "guarded": "I bought big on hype once. It didn't pay off, and I learned my lesson.",
            "warm": "Years back I chased peak power and jumped to a slick, well-funded engine program that promised the moon on the dyno. The numbers were real, but they treated my little team like an afterthought — parts came late, my calls went to a queue — and we DNF'd our way through a season I'd spent everything on.",
            "candid": "I once left my family builder for a season to run a corporate engine outfit that had the best horsepower figures in the field, and it's the deepest regret of my career. Not because of the two engine failures that torched my championship hopes at the endurance rounds — it's that I turned my back on the people who'd stood by me for twenty years to do it, and I saw the look on my old builder's face when I told him. I crawled back the next year, and I swore I'd never again pick a stopwatch over the people who show up for you. That's the whole reason I'm sizing you up on character first."
          }
        }
      }
    }
  }
];
