/* persona-scripts.js — canned, trust-tiered interview dialogue per customer archetype.
   Authored offline; consumed by js/persona.js. Intent keys: barrier, current, switch, price, committee, regret. */
window.ClarityPersonaScripts = {
  "risk-reducer": {
    "greeting": "Before we start, I should tell you: I've already read everything on your site twice. Convince me I'm not making a mistake.",
    "confession": "Honestly? It's not the money that scares me, it's being the person who signed off on the wrong thing. I've been burned before, and I still think about it. So when I go slow and ask the same question three different ways, it's not that I distrust you — it's that I don't yet trust myself to spot the catch.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — my hesitation isn't about you, it's about the version of me that has to defend this choice later.",
        "guarded": "I don't have enough proof yet. I need to see this actually work for someone before I put my name on it.",
        "warm": "The biggest thing stopping me is that everything you're claiming is still just a claim to me. Show me references I can call, real numbers, a guarantee if it doesn't land — then we're talking.",
        "candid": "The real barrier is fear of being wrong in front of people who'll remember. I can absorb a cost; I can't easily absorb being the one who championed a dud. Give me a way to be safe if this fails and half my resistance disappears."
      },
      "current": {
        "fragment": "Now you know — my current setup isn't great, but it's predictable, and predictable is a kind of safe.",
        "guarded": "I've got a way that works well enough for now. It's not perfect, but I know exactly what it does.",
        "warm": "Honestly I've stitched together a workaround I trust because I've tested it to death. It's clunky and it costs me time, but there are no surprises — and surprises are what I'm trying to avoid.",
        "candid": "I keep doing it the hard way because the hard way has never blindsided me. Every shortcut I've tried in the past had a hidden failure I only found once I'd committed. So I'd rather bleed a little time than gamble on something that might crater when I'm not looking."
      },
      "switch": {
        "fragment": "Now you know — I don't switch on a pitch, I switch on evidence I couldn't argue with.",
        "guarded": "I'd need to see it working somewhere real first. A demo isn't proof.",
        "warm": "Give me a low-risk way to try it — a trial, a pilot, something I can pull out of cleanly — plus a couple of references who look like me and aren't hand-picked cheerleaders.",
        "candid": "I'll switch when the risk of staying finally outweighs the risk of moving, and you make the move itself feel reversible. Let me test it small, talk to people who've been burned and stayed anyway, and know there's a clean exit — then I can actually let go of what I've got."
      },
      "price": {
        "fragment": "Now you know — a cheap price actually makes me more nervous, not less.",
        "guarded": "That depends entirely on what protections come with it. Price alone doesn't tell me much.",
        "warm": "I'll pay a fair, even premium, amount if it buys me certainty — a guarantee, real support, proof it holds up. What I won't do is chase a discount that looks too good to be safe.",
        "candid": "I'll pay more than most people to feel protected, because to me the price tag is really the price of not lying awake wondering if I got played. A steep discount reads as a warning sign — my gut says nobody cuts that deep unless something's wrong underneath."
      },
      "committee": {
        "fragment": "Now you know — even when it's technically my call, it's never only my call in my head.",
        "guarded": "There are a few other people who'd want a say before this goes anywhere.",
        "warm": "I'll be the one doing the digging, but I have to bring others along — and at least one of them will look for reasons to say no. I need materials solid enough to survive that scrutiny without me in the room.",
        "candid": "The truth is I run every decision past an imaginary skeptic before I run it past a real one — usually the person who'd hold it against me if it went sideways. So give me the documentation, the guarantees, the references in writing, because I'm not just selling this to a committee, I'm arming myself to defend it."
      },
      "regret": {
        "fragment": "Now you know — one bad buy years ago is still quietly writing my rules today.",
        "guarded": "Yeah, there was one. I moved too fast on a promise that didn't hold. Lesson learned.",
        "warm": "I once bought on charm and urgency instead of proof — great pitch, glossy claims, and it fell apart the moment I actually leaned on it. The worst part wasn't the loss, it was realizing I'd ignored my own instinct to check.",
        "candid": "I got talked into something because I liked the person and didn't want to seem difficult by asking for evidence. It failed, and I quietly paid for that for a long time — not just the cost, the embarrassment of having vouched for it. That's exactly why I'm slow with you now: I promised myself I'd never again trade proof for politeness."
      }
    }
  },
  "performance": {
    "greeting": "Alright, impress me. What can your product actually do that the alternatives can't — and can you prove it?",
    "confession": "Here's the thing I don't say out loud: half my benchmarking obsession is armor. I've been burned by slick demos that fell apart in production, and now I over-index on data because getting it wrong once made me look like an idiot in front of people I respect. I'd rather stall a decision for a month than be the person who bought the hype.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — I don't buy stories, I buy evidence, and most of you don't have any.",
        "guarded": "I haven't seen proof it actually outperforms what I've already got.",
        "warm": "The gap between your marketing page and your real numbers is the whole problem — everyone claims 'best in class,' nobody shows the methodology behind it.",
        "candid": "Honestly? I'm ready to buy the moment someone hands me a clean, reproducible benchmark against a named competitor. The barrier isn't price or trust, it's that I've never once gotten hard data on the first ask — and that silence tells me you're hiding the result."
      },
      "current": {
        "fragment": "Now you know — my 'current solution' is a duct-taped rig I keep alive because at least I know its numbers cold.",
        "guarded": "I've got a setup that works well enough for now.",
        "warm": "It's a stack I've tuned myself over a couple years — not elegant, but I know exactly where it breaks and how fast it runs, and that predictability is worth a lot.",
        "candid": "Truth is I've optimized my current workflow to death, and it's probably held together with scripts nobody else could maintain. I know it's not the best-in-class answer anymore, but I trust it because I've measured every inch of it — and switching means giving up numbers I already believe for numbers I'd have to re-verify."
      },
      "switch": {
        "fragment": "Now you know — I'll switch the second the math is undeniable, and not one day before.",
        "guarded": "A clear, measurable edge over what I run now.",
        "warm": "Show me a meaningful jump on the metric I actually care about — not a 3% you rounded up, a real gap — and make the migration cost low enough that the payback is obvious.",
        "candid": "I'll switch when the performance delta is big enough to survive my own skepticism after I stress-test it. I want to break your product myself, on my worst-case workload, and still see it beat my baseline. Do that, and I'm not just a customer — I become the person who evangelizes you to everyone in my network."
      },
      "price": {
        "fragment": "Now you know — price barely registers for me; cost-per-result is the only number I respect.",
        "guarded": "Depends entirely on the performance I get back.",
        "warm": "I don't flinch at premium pricing — I'll happily pay double the market if you're genuinely the top performer, because the outcome pays for itself many times over.",
        "candid": "Sticker price is almost irrelevant to me; what I'm actually buying is the result, so I calculate cost-per-outcome and compare that. Charge me a fortune and be the best, I'm in. Charge me a discount and be middle-of-the-pack, and you've wasted my time — 'cheap' is the fastest way to lose me."
      },
      "committee": {
        "fragment": "Now you know — I'm the one who decides, but I still have to win the room with data.",
        "guarded": "A few of us weigh in before anything gets approved.",
        "warm": "I drive the technical evaluation, but there's someone above me watching the budget who wants the ROI spelled out in plain terms.",
        "candid": "Realistically, I'm the one who makes the call and I'll die on the hill of the best option — but I need ammunition, because I have to translate my benchmarks into a story for people who don't care about specs, only outcomes. Give me a crisp ROI narrative I can hand upward, and you've made me your internal champion."
      },
      "regret": {
        "fragment": "Now you know — the purchase I regret is the one time I trusted the pitch instead of the data.",
        "guarded": "Bought something once on reputation alone. Won't do that again.",
        "warm": "I got seduced by a polished demo and great reviews, skipped my own testing to move fast, and it underperformed the second it hit real conditions.",
        "candid": "There was a tool everyone swore by — beautiful demo, glowing case studies — and I bought it without running my own benchmark because I was in a hurry. It collapsed under my actual load, I'd already committed publicly to it, and eating that mistake in front of my peers is exactly why I now trust nothing but numbers I generate myself. That scar is why you get the skepticism you get."
      }
    }
  },
  "cost": {
    "greeting": "Alright, before you start — what's this actually gonna run me? I've got three other tabs open comparing you right now.",
    "confession": "Honestly? Half the time I don't even want the cheaper thing — I just can't stand the feeling of finding out later I overpaid. That little sting of \"you could've had it for less\" keeps me up more than it should. I'll spend two hours saving twelve bucks and call it a win.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — the price tag isn't the wall, the fear of a better deal I haven't found yet is.",
        "guarded": "Price. Plain and simple, you're not the cheapest option I'm looking at.",
        "warm": "It's not just your number, it's that I don't trust it's your real number. Everybody's got a discount for somebody, and I always assume I'm getting the sucker price.",
        "candid": "The real thing stopping me is that I know the second I commit, I'll see it cheaper somewhere and feel like an idiot. So I stall, I compare, I wait for a sale — and honestly the stalling costs me more than just buying would. I know that. I still do it."
      },
      "current": {
        "fragment": "Now you know — my current 'solution' is mostly duct tape and stubbornness because it's free.",
        "guarded": "I make do with what I've got. It's not perfect but it doesn't cost me extra.",
        "warm": "I've cobbled together a cheap workaround that mostly works. It's clunky and eats my time, but every month I don't pay for something feels like a small win.",
        "candid": "Truthfully I'm limping along on the free version, an old tool, and a lot of workarounds I'm too proud to admit are painful. It's costing me hours I don't count because those hours don't show up on a bill — and that's exactly how I trick myself into thinking it's cheaper."
      },
      "switch": {
        "fragment": "Now you know — I'll switch the moment the math beats loyalty, and loyalty barely registers.",
        "guarded": "A better price. Show me real savings and I'm listening.",
        "warm": "Give me a bundle where the numbers obviously win, or lock in a rate before it goes up, and I'll move fast. I don't get attached to who I'm buying from.",
        "candid": "I'll switch for surprisingly little — a better deal, a bundle that makes the per-unit cost look silly, or a 'this price ends Friday' that actually feels real. I've left providers I liked over a few bucks. Loyalty's never once stopped me from chasing a cheaper cart."
      },
      "price": {
        "fragment": "Now you know — my 'budget' is really just the number below what I've quietly decided you're worth.",
        "guarded": "Less than you're asking, I can tell you that much.",
        "warm": "I'll pay what's fair, but 'fair' to me means the lowest price I've seen anyone else get. Anchor me high and I'll assume there's room to come down.",
        "candid": "Here's the ugly truth — I'll pay more than I let on, but only if I'm convinced I squeezed you first. Give me a discount, a bundle, anything that lets me feel like I won the negotiation, and I'll happily hand over money I swore I didn't have. It's the feeling of a deal I'm buying, almost more than the thing."
      },
      "committee": {
        "fragment": "Now you know — 'I need to check with someone' is half real, half my favorite exit ramp.",
        "guarded": "I've got a couple people to run it by before anything's final.",
        "warm": "There's someone who watches the money with me, sure. But I'll be honest, sometimes 'I have to ask them' is just my polite way of buying time to shop around.",
        "candid": "Real answer? It's mostly me, and whoever I live with who'll ask 'why'd we pay that much?' The committee I'm actually scared of is future-me, six months from now, finding a better deal and feeling robbed. I'll use 'let me check with them' as a stall every single time — because the second I say yes, the comparison shopping has to stop, and I hate stopping."
      },
      "regret": {
        "fragment": "Now you know — my worst regret wasn't spending too much, it was spending fast.",
        "guarded": "Yeah, I've overpaid before. Learned my lesson, moved on.",
        "warm": "I once jumped on something at full price and saw it half off a week later. Didn't even care about the item anymore — the overpay just ate at me for months.",
        "candid": "Bought something the day before a huge sale because I got impatient. Same thing, forty percent cheaper, one week later. It wasn't even that much money, but I felt physically sick — not from losing the cash, from breaking my own rule of never being the one who paid retail. That's the regret that made me the compulsive comparer I am now. I'd rather miss out entirely than get caught overpaying again."
      }
    }
  },
  "status": {
    "greeting": "Okay, be honest with me — is this the thing everyone's about to have, or the thing I'll have first?",
    "confession": "Here's the embarrassing truth: I don't actually need half of what I buy. I need to be the person who has it before it's obvious. If people stopped noticing what I own, I'm not sure I'd know who I am anymore — and yeah, saying that out loud makes my stomach drop a little.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — I'm not scared it's bad, I'm scared it's basic.",
        "guarded": "I'm just not sure it's really for me yet.",
        "warm": "Honestly? I haven't seen anyone I respect using it. If it's not on the right feeds and the right wrists, I get nervous it makes me look like I'm trying too hard.",
        "candid": "The real block is fear of being early on the wrong thing. Being first is my whole brand, so if I champion this and it flops or turns out to be everywhere at Target next month, that's not a refund — that's a hit to my taste, and my taste is the only thing I can't return."
      },
      "current": {
        "fragment": "Now you know — I don't 'solve' this, I curate around it.",
        "guarded": "I've got a workaround that does the job for now.",
        "warm": "Right now I piece it together with whatever the tastemakers I follow are using. It's not seamless, but it looks intentional, and honestly the look matters as much as the function.",
        "candid": "Truthfully I've been limping along with a setup I'm a little embarrassed by, and I overcompensate by making it look deliberate in photos. Nobody knows the seams are held together with vibes — but I know, and it quietly bugs me every single day."
      },
      "switch": {
        "fragment": "Now you know — I switch when the room switches, not when the spec sheet does.",
        "guarded": "It'd have to feel like a genuine step up, not sideways.",
        "warm": "Show me two or three people I actually admire making the jump and not looking back — that moves me way more than any feature list you could send.",
        "candid": "I'll switch the second staying put starts to feel dated. The moment the crowd I want to be seen with treats my current thing as last season, I'm gone — I'd rather pay a premium to move early than get caught defending something that already peaked."
      },
      "price": {
        "fragment": "Now you know — I'm not paying for the product, I'm paying for the position.",
        "guarded": "Depends — I'm not really shopping on price.",
        "warm": "I'll pay more than makes sense on paper if it carries the right cachet. Cheap actually scares me here; if it's too accessible, it stops meaning anything to own.",
        "candid": "Give me a real number and I'll probably go higher, because a little bit of 'ouch' is the point — the price tag is part of the story I get to tell. What I won't pay for is something priced like it wants everyone; make me feel like the price is a velvet rope, and I'm in."
      },
      "committee": {
        "fragment": "Now you know — the 'committee' is really an audience.",
        "guarded": "It's mostly my call.",
        "warm": "Officially it's just me, but I read the room first — the few people whose opinion I'd actually screenshot get a quiet vote before I commit.",
        "candid": "Truth is the decision-makers are the people I'm hoping will notice. I'll run it past one or two friends with taste, but really I'm imagining the comments, the DMs, the 'wait, where did you get that' — if I can't picture that moment, I don't buy, no matter what the spec says."
      },
      "regret": {
        "fragment": "Now you know — my worst buys were the ones nobody clocked.",
        "guarded": "Yeah, I've had a couple of misses.",
        "warm": "I bought something hyped once, right at the peak, and by the time it showed up everyone already had it. Great product, zero magic — I basically never used it after the first post.",
        "candid": "The one that still stings: I chased a drop, paid resale, felt like a genius for a week — then it went mainstream and suddenly owning it made me look like a follower, not a leader. That's my real fear with any purchase: not that it breaks, but that it becomes ordinary while it's still sitting in my cart."
      }
    }
  },
  "convenience": {
    "greeting": "Okay, quick version — I've got about ninety seconds and one hand free, so make this easy or I'm gone.",
    "confession": "Honestly? I overpay for stuff constantly just so I don't have to think about it. I know I could find cheaper or better if I dug around, but the digging is the part that kills me — my time and my attention are the things I'm actually protecting, and I'll throw money at almost anything that gives me those back.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — the thing stopping me isn't the price, it's the amount of steps.",
        "guarded": "If it looks like a hassle to set up, I'm probably out.",
        "warm": "It's the effort, not the money. The second I sense a long form or a 'let's schedule a call,' my brain checks out.",
        "candid": "The real barrier is that I've been burned by things that promised easy and then made me do the work anyway. So now I flinch at anything that smells like more than a couple taps — I'd rather stay with my clunky current thing than risk sinking an afternoon into your setup."
      },
      "current": {
        "fragment": "Now you know — my current 'system' is mostly duct tape and low expectations.",
        "guarded": "I've got a workaround that mostly does the job.",
        "warm": "Honestly I just cobbled something together a while back and stopped questioning it. It's not great, but it runs without me thinking about it, so it stays.",
        "candid": "I handle it by ignoring it until it becomes a fire, then I throw money or a quick fix at it from my phone and move on. It's inefficient and I know it — but 'good enough and out of my face' beats 'perfect but demanding' every single time for me."
      },
      "switch": {
        "fragment": "Now you know — I'll switch the instant something is genuinely less work, not just 'better.'",
        "guarded": "It'd have to be noticeably easier than what I do now.",
        "warm": "Show me it saves me actual steps and I'm interested. I don't care about extra features — I care about doing less.",
        "candid": "I'll switch the moment you make my current thing feel like a chore by comparison. If I can start it in under a minute, on my phone, without reading instructions — and it just works the first time — you've got me, and I won't even shop around."
      },
      "price": {
        "fragment": "Now you know — I'll happily pay a premium, as long as the premium buys me zero friction.",
        "guarded": "I'll pay a fair bit if it actually saves me the hassle.",
        "warm": "I'm not the cheapest customer — I'll pay more than the next person if it means less effort. What I won't do is pay and still have to work for it.",
        "candid": "Genuinely, I'll pay a premium just to skip the annoyance — the exact number matters way less than whether checkout is instant and I never have to think about it again. But charge me premium prices and then make me fight the thing? I'll rage-cancel and never come back."
      },
      "committee": {
        "fragment": "Now you know — the fewer people I have to loop in, the faster you get a yes.",
        "guarded": "Mostly just me on small stuff.",
        "warm": "For anything quick I decide solo — that's the whole point. If I have to consult someone, the decision usually just dies from inertia.",
        "candid": "Realistically it's me and me. The moment a purchase needs a second opinion or a group chat to sign off, it drops to the bottom of my list and rots there. So if you can keep it in the 'I can just decide this myself' zone, you've dodged my biggest deal-killer."
      },
      "regret": {
        "fragment": "Now you know — my regrets are always the things that turned out to need babysitting.",
        "guarded": "Bought something once that ended up being way more effort than it was worth.",
        "warm": "There was this thing I got because it looked slick, and then it needed constant fiddling to actually work. I used it twice and quietly gave up.",
        "candid": "The one that stings — I paid extra for a 'premium, effortless' upgrade and it shipped with setup steps a mile long. I felt tricked, because effortless was the entire reason I bought it. That's exactly the wound you're up against: promise me easy and deliver hard, and I don't just refund, I tell everyone."
      }
    }
  },
  "community": {
    "greeting": "Okay, before we get into features and all that — tell me who's actually behind this. That's what I care about.",
    "confession": "Honestly? I've talked myself into buying things I didn't need just because I loved the people making them and I wanted to be part of it. I know that's not \"smart shopping.\" But I'd rather belong to something real than get a slightly better deal from a faceless company that wouldn't notice if I disappeared.",
    "intents": {
      "barrier": {
        "fragment": "Now you know — I'm not buying a product, I'm deciding whether to join you, and I can't tell yet if there's a real 'you' to join.",
        "guarded": "I don't really know you yet. Give me a reason to trust that you're in this for more than the sale.",
        "warm": "The thing holding me back is that it still feels transactional — I can't find the people or the story behind it, and that matters to me more than the spec sheet.",
        "candid": "Honestly, I'm scared I'll buy in, tell everyone I know about you, and then find out there's no 'we' here — just a checkout page and a logo. I've been burned by a brand that talked community and treated me like a line item, and I don't want to feel that stupid again."
      },
      "current": {
        "fragment": "Now you know — my current 'solution' is mostly a group of people I trust, not a tool.",
        "guarded": "I get by. I lean on a few people I trust and figure it out together.",
        "warm": "Right now I handle it through my little circle — I ask the people in my community what they use and I just follow the ones I believe in. The actual product is almost secondary.",
        "candid": "Truthfully, I've stuck with a clunky, overpriced option way longer than I should've, purely because the founder shows up, remembers my name, and the group chat around it feels like home. I'm not solving the problem efficiently — I'm staying loyal, and I know it."
      },
      "switch": {
        "fragment": "Now you know — I don't switch for features, I switch for people and mission.",
        "guarded": "It'd have to feel like more than a better deal. I don't leave people easily.",
        "warm": "I'd switch if I felt like you actually stood for something and that the people around your product were 'my people.' A cause I believe in beats a discount every time.",
        "candid": "Here's the real answer: I'd leave what I have the moment I felt like I mattered more to you than I do to them — if you knew my name, welcomed me in, and I could see you actually living your values, not just printing them on a banner. Belonging is the switching cost for me, not price."
      },
      "price": {
        "fragment": "Now you know — I'll pay more for something I'm proud to be part of.",
        "guarded": "I can pay a fair price. I'm not looking for the cheapest option.",
        "warm": "I'll genuinely pay a premium if I believe in what you're building — money spent with people I trust doesn't feel like a cost, it feels like a vote.",
        "candid": "Look, I've paid noticeably more than I 'should' just to keep my money with people whose mission I love — and I'd do it for you too. But the flip side is real: charge me like I'm just a wallet, and no discount will keep me, because at that point you've told me the belonging was never real."
      },
      "committee": {
        "fragment": "Now you know — my 'committee' is basically the people I'd end up recommending you to.",
        "guarded": "It's not just me. I usually run things by the people I trust.",
        "warm": "I talk to my circle before I commit — friends, my group, the folks whose taste I respect. If they feel good about you, I'm in, and then I become the one bringing everyone else along.",
        "candid": "Honestly, the real decision-makers are the people I'll refer you to. I won't put my name on something and drag my community into it unless I'm sure you'll treat them the way I'd treat them — my reputation with my people is on the line every time I say 'you have to try this.'"
      },
      "regret": {
        "fragment": "Now you know — my worst regret wasn't wasted money, it was misplaced loyalty.",
        "guarded": "Yeah, there's one. I bought in hard and it didn't turn out to be what they made it seem.",
        "warm": "I once went all-in on a brand that sold this whole 'we're a family' story — I bought it, promoted it, defended it — and then they sold out and quietly stopped caring. The product was fine; the betrayal is what stung.",
        "candid": "The one I still cringe about: I championed them to everyone, talked them up in my group, staked my credibility on them — and then they cashed out and treated all of us like acquired data. What I regret isn't the money, it's that I made my friends trust them because I did. That's exactly the wound you'd need to convince me you won't reopen."
      }
    }
  }
};
