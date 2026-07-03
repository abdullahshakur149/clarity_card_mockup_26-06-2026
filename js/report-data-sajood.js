/* ============================================================================
   report-data-sajood.js — sajood's Strategic-Planning report content, ported
   verbatim for all sectors. Rendered through Clarity's report viewer
   (Accordion/Tabs toggle + pre-report stat cards preserved).
   ========================================================================== */
window.SajoodReports = {
    market: {
      food: {
        overview: 'The local food and hospitality market is experiencing strong growth in artisan and experience-led dining, with specialty food businesses growing at 8.4% annually across Australasia. Consumers are actively seeking out authentic, locally sourced products and willing to pay a meaningful premium for provenance and founder-led storytelling. Independent operators are well-positioned to capture this sentiment where chains cannot.',
        trend: { icon: '📈', headline: 'The \'Local First\' Premium', body: 'Consumers are paying 20–35% more for food products with verified local provenance and clear founder stories — a gap that supermarkets and chains are structurally unable to fill.' },
        marketSize: { figure: '$4.2M', interpretation: 'That\'s big enough to build a real business, focused enough that you can own a corner of it.' },
        marketTable: [
          { dim: 'Market Size', finding: '$4.2M in annual category revenue in your region — enough room to build a focused, profitable business without needing to dominate the whole category.', confidence: '82%' },
          { dim: 'Growth Rate', finding: '8.4% year-over-year growth in the artisan and specialty food segment — roughly 3x faster than mainstream grocery.', confidence: '87%' },
          { dim: 'Price Premium', finding: '20–35% more that customers will pay once provenance and a founder story are visible — the core monetizable gap in this market.', confidence: '84%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'There is a clear opening for independent food businesses that deliver artisan quality with the consistency and visibility of a small chain. Most local operators underinvest in brand — the gap is in the story and the reach, not the product itself.',
          action: 'Lean into your story — where the ingredients come from, who makes it, why it\'s different — instead of competing on price.',
          reasons: [
            'Most local operators are skilled at making food, not telling the story behind it — so quality goes unnoticed outside their existing customer base.',
            'Chains have the marketing budget but none of the authenticity — they can\'t credibly claim a founder story or local sourcing.',
            'Supermarket prepared food wins on convenience alone, with almost no emotional connection to the customer.'
          ],
          oppTable: [
            { opportunity: 'Subscription or pre-order model for regulars', size: '$800–$1,500/mo added recurring revenue', difficulty: 'Low' },
            { opportunity: 'Farmers market + local delivery hybrid', size: '15–25% revenue lift', difficulty: 'Medium' },
            { opportunity: 'Wholesale supply to local cafés/retailers', size: '$2,000–$5,000/mo per account', difficulty: 'High' }
          ]
        },
        buyers: {
          chips: ['Ages 25–45', 'Middle to upper income', 'Lives in the city or suburbs', 'Cares about where food comes from'],
          driver: 'These customers aren\'t just hungry — they want to feel good about what they\'re buying. They\'ll pay more for food that feels honest, local, and made with care.',
          psychographics: [
            { label: 'Supports Real People', desc: 'They want to feel like they\'re supporting a real person, not a faceless chain.' },
            { label: 'Show, Don\'t Tell', desc: 'They\'ll pay extra for quality, but they need to see the extra care, not just hear about it.' },
            { label: 'Fast, Visual Deciders', desc: 'They decide fast — usually based on how it looks and what a friend said, not research.' },
            { label: 'Loyal to the Experience', desc: 'They come back when the experience feels personal, not just when the food is good.' }
          ],
          demoTable: [
            { age: '25–34', revenueRange: '$60K–$90K household income', percentShare: '34%' },
            { age: '35–45', revenueRange: '$90K–$140K household income', percentShare: '41%' },
            { age: '46–60', revenueRange: '$60K–$110K household income', percentShare: '25%' }
          ]
        },
        competitors: [
          { name: 'Chain Operators', pos: 'Volume and price. Limited local authenticity or founder connection.', strength: 'Everywhere, cheap, and fast', weakness: 'Feels the same in every location — no personality', priceRange: '$5–$12 per item' },
          { name: 'Ghost Kitchens', pos: 'Delivery-first, no dine-in experience or brand depth.', strength: 'Great at delivery, low overhead', weakness: 'No dine-in experience, nothing to remember them by', priceRange: '$12–$22 per order' },
          { name: 'Supermarket Deli', pos: 'Convenience-led. Low emotional connection with customers.', strength: 'Convenient, already on the way home', weakness: 'Nobody feels excited buying it', priceRange: '$4–$9 per item' }
        ],
        competitorGapNote: 'None of these compete on story or connection — that\'s where you win, not on speed or price.',
        findings: [
          { headline: 'Local, story-driven food brands are outgrowing the supermarket aisle.', body: 'Independent operators with a clear story are growing 8.4% a year, nearly three times faster than mainstream grocery. That gap is widening as more shoppers actively seek out food they can trust the origin of.' },
          { headline: 'Provenance commands a real price premium.', body: 'Customers will pay 20–35% more once they know where their food came from and who made it. This premium holds even in price-sensitive categories, provided the story is visible at the point of purchase.' },
          { headline: 'The biggest gap in this market is brand, not product.', body: 'Most local operators already make food that tastes great — what\'s missing is a consistent, visible identity. Businesses that invest in packaging, photography, and storytelling convert that quality into recognition.' },
          { headline: 'Chains win on convenience, not connection.', body: 'Nobody remembers a chain\'s story because it doesn\'t have one. Independent operators who lead with personality and place can build loyalty a franchise structurally cannot replicate.' },
          { headline: 'Process content outperforms polished product shots.', body: 'The businesses growing fastest right now are the ones showing their process — sourcing, prep, the people behind it — rather than just the finished plate. It also requires far less production budget than glossy advertising.' }
        ],
        evidence: [{ pub: 'Food & Beverage Quarterly', snippet: 'Artisan food sector grew 8.4% YoY, outpacing mainstream grocery', confidence: '87%' }, { pub: 'IBISWorld NZ', snippet: 'Independent café closures offset by premium niche openings in 2025', confidence: '82%' }, { pub: 'Statista Consumer Trends', snippet: '67% of consumers willing to pay premium for locally sourced ingredients', confidence: '91%' }],
        sourcesMore: [
          { pub: 'Deloitte Consumer Food Trends 2025', snippet: 'Provenance and traceability now rank among the top 3 purchase drivers for premium food buyers', confidence: '80%' },
          { pub: 'NPD Group Foodservice Report', snippet: 'Independent café visit frequency up 14% among loyal repeat customers in 2025', confidence: '77%' },
          { pub: 'Instagram Business Insights', snippet: 'Food posts featuring sourcing or process content see 2.1× higher engagement than product-only posts', confidence: '75%' },
          { pub: 'Google Local Search Trends', snippet: '"Local food near me" search volume up 22% year-over-year', confidence: '81%' },
          { pub: 'Kantar Worldpanel FMCG', snippet: 'Premium artisan segment resilient to inflation-driven category-wide volume declines', confidence: '78%' }
        ]
      },
      retail: {
        overview: 'Retail is undergoing a fundamental shift toward direct-to-consumer models, with physical retail consolidating while online-first independent brands take share. Shoppers are bypassing traditional chains in favour of niche brands with a clear point of view. The mid-market is hollowing out — creating a structural opening for specialist independents with strong brand identity.',
        trend: { icon: '🛍️', headline: 'DTC Brands Are Winning on Story', body: 'Retail brands with a clear founder narrative and community-first approach are growing 3× faster than category averages — with customer lifetime value meaningfully higher than acquisition-led peers.' },
        marketSize: { figure: '$6.8M', interpretation: 'Enough room for a focused brand to grow steadily without needing to beat the giants at their own game.' },
        marketTable: [
          { dim: 'Market Size', finding: '$6.8M in annual category revenue addressable by independent DTC brands in your segment — plenty of room without competing head-on with mass retail.', confidence: '85%' },
          { dim: 'Growth Rate', finding: '3× faster growth for story-led independent brands compared to category-average retail peers.', confidence: '89%' },
          { dim: 'Loyalty Premium', finding: '12% higher share of wallet captured by independent retail brands among the core 25–44 demographic.', confidence: '84%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'Mid-market retail is contracting on both ends. Specialist independents who invest in community before conversion — and who build emotional brand equity alongside their product — are capturing the loyalty that mass-market players cannot.',
          action: 'Build your brand story before you build your ad spend — trust converts better than any discount.',
          reasons: [
            'Mass-market chains compete on range and price, leaving no room to build a personal relationship with any single customer.',
            'E-commerce aggregators optimise for discoverability, not loyalty — customers compare and move on without remembering the brand.',
            'Most independents underinvest in the story layer, so their product quality never translates into recognition or repeat purchase.'
          ],
          oppTable: [
            { opportunity: 'Founder-led email list with launch previews', size: '20–30% of revenue from repeat buyers', difficulty: 'Low' },
            { opportunity: 'Limited-drop or collaboration releases', size: '2–3× normal order value on drop days', difficulty: 'Medium' },
            { opportunity: 'Owned community (Discord/private group)', size: '15–20% lift in customer lifetime value', difficulty: 'High' }
          ]
        },
        buyers: {
          chips: ['Ages 28–50', 'Dual-income households', 'Shops online first', 'Researches before buying'],
          driver: 'These shoppers do their homework. They compare, they read reviews, and they choose brands that feel like they stand for something — not just the cheapest option.',
          psychographics: [
            { label: 'Trust Before Price', desc: 'They check reviews and social proof before clicking buy — trust comes before price.' },
            { label: 'Values-Aligned Spending', desc: 'They\'ll pay more for a brand that shares their values, not just a better spec sheet.' },
            { label: 'Early Discovery Pride', desc: 'They want to feel smart about their purchase, like they found something before their friends did.' },
            { label: 'Hard-Won Loyalty', desc: 'They stay loyal once a brand earns their trust — but that trust is hard to win back if broken.' }
          ],
          demoTable: [
            { age: '25–34', revenueRange: '$70K–$100K household income', percentShare: '31%' },
            { age: '35–50', revenueRange: '$100K–$160K household income', percentShare: '46%' },
            { age: '51–65', revenueRange: '$80K–$130K household income', percentShare: '23%' }
          ]
        },
        competitors: [
          { name: 'Mass-Market Chains', pos: 'Price and range. No community depth or brand intimacy.', strength: 'Huge selection, always in stock', weakness: 'Nothing about them feels personal or special', priceRange: '$15–$60 per item' },
          { name: 'E-commerce Aggregators', pos: 'High discoverability via marketplace. Low brand loyalty.', strength: 'Easy to find, easy to compare', weakness: 'Race to the bottom on price, no loyalty', priceRange: '$10–$50 per item' },
          { name: 'Pop-Up Specialists', pos: 'Event-led presence. Limited repeat purchase infrastructure.', strength: 'Feels exciting and limited-time', weakness: 'Hard to build repeat customers', priceRange: '$25–$90 per item' }
        ],
        competitorGapNote: 'None of these build real community or brand loyalty — that\'s the lane that\'s wide open.',
        findings: [
          { headline: 'Independent brands with a clear story are outpacing the category.', body: 'Story-led DTC brands are growing three times faster than category averages. The gap comes from trust, not product superiority — customers choose brands they feel they understand.' },
          { headline: 'Research now happens before every purchase.', body: 'Shoppers compare, read reviews, and check values-alignment before buying — trust now matters more than the lowest price. Brands that make this research easy convert at a noticeably higher rate.' },
          { headline: 'The middle of the market is disappearing.', body: 'Retail brands increasingly need to be either the cheapest option or a meaningful one — average positioning converts poorly either way. This is pushing independents toward clearer, sharper brand identities.' },
          { headline: 'Story-driven customers spend more and return more often.', body: 'Customers who connect emotionally with a brand\'s story show measurably higher order values and repeat purchase rates. That connection is built well before the first sale, not after it.' },
          { headline: 'Community-building is outperforming pure acquisition spend.', body: 'Brands that build an owned community — email, private groups, or loyalty programs — are growing faster than brands relying solely on paid acquisition. The compounding effect shows up most clearly after the first 90 days.' }
        ],
        evidence: [{ pub: 'Retail Intelligence Report', snippet: 'DTC brands outperforming wholesale-led peers by 3.1× in 2025', confidence: '89%' }, { pub: 'Nielsen Consumer Pulse', snippet: 'Independent retail share of wallet up 12% among 25–44 demographic', confidence: '84%' }, { pub: 'Deloitte Commerce Study', snippet: 'Brand story cited as top purchase driver for 58% of independent retail shoppers', confidence: '79%' }],
        sourcesMore: [
          { pub: 'Shopify Commerce Trends 2025', snippet: 'Repeat customer rate 2.4× higher for brands with an active email list vs social-only brands', confidence: '83%' },
          { pub: 'McKinsey Consumer Pulse Survey', snippet: 'Value-aligned purchasing now cited by 61% of shoppers under 45 as a key decision factor', confidence: '80%' },
          { pub: 'Klaviyo Ecommerce Benchmark', snippet: 'Founder-voice email campaigns see 34% higher open rates than generic promotional sends', confidence: '76%' },
          { pub: 'BigCommerce Retail Outlook', snippet: 'Limited-drop release strategies increase average order value by up to 2.6×', confidence: '78%' },
          { pub: 'Bain Loyalty Economics Report', snippet: 'A 5% increase in customer retention can increase profit by 25–95% across retail categories', confidence: '85%' }
        ]
      },
      creative: {
        overview: 'The creative services market is expanding rapidly, driven by the explosion in content demand across digital channels. Businesses of every size now require visual identity, video, and social content — creating a large addressable market for independent creative operators. AI tools are reshaping production economics while simultaneously increasing demand for high-touch, strategic creative work that AI cannot replicate.',
        trend: { icon: '✨', headline: 'High-Touch Creative Outperforms AI-First', body: 'Clients are actively seeking human-led studios after disappointing results from AI-only production. Premium positioning is less competitive than mid-market, with higher client retention and larger project values.' },
        marketSize: { figure: '$3.6M', interpretation: 'Plenty of room to build a focused studio without competing against the big agencies for enterprise clients.' },
        marketTable: [
          { dim: 'Market Size', finding: '$3.6M in local addressable spend on independent creative services — sized for a focused studio, not an agency-scale operation.', confidence: '81%' },
          { dim: 'Growth Rate', finding: '14% year-over-year revenue growth for independent creative operators, outpacing the traditional agency sector.', confidence: '86%' },
          { dim: 'Client Preference', finding: '71% of SMB clients say they prefer a boutique studio over a large agency for brand-defining work.', confidence: '83%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'Most creative operators compete on portfolio. Almost none compete on outcome-based positioning — articulating the revenue impact or brand equity their work creates. Independents who package strategy + execution together command significantly higher rates and lower client churn.',
          action: 'Talk about the business results your work creates, not just how it looks — that\'s what gets you higher rates.',
          reasons: [
            'Large agencies default to deliverable-based pricing because that\'s what their internal structure is built around, not because it\'s what clients actually want.',
            'Freelance marketplaces have no strategic layer at all — they execute a brief but never question whether it\'s the right brief.',
            'Very few independents have the confidence (or case study proof) to price and pitch on business outcomes instead of hours or deliverables.'
          ],
          oppTable: [
            { opportunity: 'Retainer-based ongoing brand partnerships', size: '$2,000–$6,000/mo per client', difficulty: 'Medium' },
            { opportunity: 'Outcome-based case study library', size: '20–30% higher close rate on pitches', difficulty: 'Low' },
            { opportunity: 'Strategy + execution bundled packages', size: '1.5–2× higher project value', difficulty: 'Medium' }
          ]
        },
        buyers: {
          chips: ['Ages 30–50', 'Founders & marketing leads', 'Time-poor', 'Growth-focused'],
          driver: 'These buyers aren\'t shopping for pretty pictures. They\'re stretched thin and need someone they can trust to just handle it — and make them look good doing it.',
          psychographics: [
            { label: 'Speed Over Process', desc: 'They want results fast, not a 3-month onboarding process before anything gets made.' },
            { label: 'Chemistry First', desc: 'They care more about chemistry and trust than a flashy portfolio.' },
            { label: 'Pays for Peace of Mind', desc: 'They\'ll pay a premium for someone who takes the thinking off their plate, not just the execution.' },
            { label: 'Loyal to Ease', desc: 'They keep working with people who make their life easier, even if a cheaper option exists.' }
          ],
          demoTable: [
            { age: '28–38', revenueRange: '$250K–$800K annual business revenue', percentShare: '38%' },
            { age: '38–50', revenueRange: '$800K–$3M annual business revenue', percentShare: '44%' },
            { age: '50–60', revenueRange: '$3M+ annual business revenue', percentShare: '18%' }
          ]
        },
        competitors: [
          { name: 'Large Creative Agencies', pos: 'Full-service but expensive and slow. Often over-built for SMBs.', strength: 'Can do everything under one roof', weakness: 'Slow, expensive, and overkill for a small business', priceRange: '$15,000–$80,000 per project' },
          { name: 'Freelance Marketplaces', pos: 'Low cost. No strategic layer, inconsistent quality and accountability.', strength: 'Cheap and fast to book', weakness: 'No strategy, quality is a gamble', priceRange: '$200–$2,000 per project' },
          { name: 'In-House Teams', pos: 'Internal alignment advantage. Limited external perspective and capacity.', strength: 'Already knows the business inside out', weakness: 'Limited capacity and no outside perspective', priceRange: '$60K–$100K/yr salary equivalent' }
        ],
        competitorGapNote: 'None of these position on business outcomes — that\'s the language your competitors aren\'t using.',
        findings: [
          { headline: 'Independent studios are growing faster than traditional agencies.', body: 'Revenue for independent creative operators is growing 14% a year, meaningfully outpacing the broader agency sector. Lower overhead and closer client relationships are the likely drivers of that gap.' },
          { headline: 'Almost nobody talks about outcomes.', body: 'Most studios compete on portfolio quality alone, rarely quantifying the business results their work produces. The few that do report materially higher average project values.' },
          { headline: 'Clients are returning to human-led creative work.', body: 'After disappointing results from AI-only production, clients are actively seeking studios that combine tools with genuine strategic judgment. This shift favors independents who can show measured thinking, not just fast output.' },
          { headline: 'Bundled strategy and execution commands a premium.', body: 'Independents who package strategic thinking together with production work charge significantly more per project than execution-only competitors. It also tends to produce lower client churn, since the relationship is harder to replace.' },
          { headline: 'Positioning as an outcome beats positioning as a deliverable.', body: 'The biggest open opportunity in this market is language — talking about growth, conversion, or brand equity rather than logos and videos. This single shift is often enough to justify a meaningfully higher rate card.' }
        ],
        evidence: [{ pub: 'Adobe Creative Economy Report', snippet: 'Independent creative operators grew revenue 14% YoY, outpacing the agency sector', confidence: '86%' }, { pub: 'Clutch B2B Research', snippet: '71% of SMB clients prefer boutique studios for brand-defining projects', confidence: '83%' }, { pub: 'Statista Digital Marketing', snippet: 'Global creative services market projected to reach $780B by 2027', confidence: '88%' }],
        sourcesMore: [
          { pub: 'HubSpot Agency Growth Report 2025', snippet: 'Agencies quoting outcomes instead of deliverables report 22% higher average deal size', confidence: '79%' },
          { pub: 'Forrester Marketing Services Study', snippet: 'Client retention 2.3× higher when creative partner is involved in strategy, not just execution', confidence: '82%' },
          { pub: 'LinkedIn Creator Economy Report', snippet: 'Founder-led case study content drives 3× more inbound inquiries than portfolio pages alone', confidence: '75%' },
          { pub: 'Adobe State of Create 2025', snippet: '64% of SMB decision-makers say they struggled to evaluate creative quality without case studies', confidence: '77%' },
          { pub: 'Gartner Marketing Spend Survey', snippet: 'SMB marketing budgets allocated to external creative partners up 9% year-over-year', confidence: '80%' }
        ]
      },
      tech: {
        overview: 'SaaS adoption across SMB and enterprise segments continues to accelerate, with global software spending projected to exceed $1.1 trillion by 2027. The new battleground is vertical SaaS — purpose-built tools for specific industries that deliver faster time-to-value than horizontal platforms. AI-native product features are now a baseline expectation rather than a differentiator, shifting competition toward user experience and niche depth.',
        trend: { icon: '⚡', headline: 'Vertical SaaS Is Capturing Mid-Market', body: 'Industry-specific software is growing at 2.4× the rate of horizontal SaaS, with SMBs prioritising solutions that require minimal configuration and deliver immediate value within their workflow.' },
        marketSize: { figure: '$1.1T', interpretation: 'Even a tiny sliver of this market is a real business — you don\'t need to win the whole category, just one clear niche.' },
        marketTable: [
          { dim: 'Market Size', finding: '$1.1T in projected global software spending by 2027 — even a fractional share of one workflow niche supports a real business.', confidence: '90%' },
          { dim: 'Growth Rate', finding: '24% CAGR for vertical SaaS vs 11% for horizontal platforms through 2027 — more than double the growth rate.', confidence: '92%' },
          { dim: 'Underserved Tier', finding: '$50–$200/month pricing tier remains meaningfully underserved for SMB buyers seeking workflow-specific tools.', confidence: '85%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'The SMB software market remains meaningfully underserved in the $50–$200/month tier. Founders who can simplify complex workflows for a clearly defined niche build defensible positions that large horizontal platforms are reluctant to attack.',
          action: 'Pick one specific type of team or workflow and go deep — trying to serve everyone is why most tools feel generic.',
          reasons: [
            'Enterprise platforms are structurally incentivised to chase larger contracts, leaving the $50–$200/month tier deliberately underserved.',
            'Horizontal SMB tools try to fit every workflow at once, which means they fit no single workflow particularly well.',
            'Spreadsheets remain the default fallback in most niches simply because no dedicated tool has proven simple enough to replace them.'
          ],
          oppTable: [
            { opportunity: 'Single-workflow vertical tool for an underserved niche', size: '$50K–$300K ARR at 200–1,000 seats', difficulty: 'Medium' },
            { opportunity: 'Free tier + self-serve upgrade funnel', size: '3–5× higher trial-to-paid conversion', difficulty: 'Low' },
            { opportunity: 'Integration-led expansion into adjacent workflows', size: '20–35% expansion revenue from existing accounts', difficulty: 'High' }
          ]
        },
        buyers: {
          chips: ['Ages 28–45', 'Founders & operators', 'Early adopters', 'Judged on ROI'],
          driver: 'These buyers move fast and evaluate software on their own — no sales calls needed. They want proof it works within minutes, not a demo next week.',
          psychographics: [
            { label: 'Impatient for Value', desc: 'They want results fast, not a lengthy setup process before they see value.' },
            { label: 'Zero Tolerance for Complexity', desc: 'They\'ll abandon a tool the moment it feels more complicated than the problem it solves.' },
            { label: 'Reads the Changelog', desc: 'They check for signs the product is actively improving before committing long-term.' },
            { label: 'Fast to Switch', desc: 'They switch tools quickly if a competitor solves their exact problem better.' }
          ],
          demoTable: [
            { age: '28–35', revenueRange: '$0–$1M ARR (early-stage team)', percentShare: '29%' },
            { age: '35–45', revenueRange: '$1M–$10M ARR (scaling team)', percentShare: '48%' },
            { age: '45–55', revenueRange: '$10M+ ARR (established operator)', percentShare: '23%' }
          ]
        },
        competitors: [
          { name: 'Enterprise Platforms', pos: 'Feature-rich but over-engineered for SMBs. Long sales cycles, high switching cost.', strength: 'Powerful and feature-complete', weakness: 'Way too complicated for a small team', priceRange: '$500–$5,000+/month' },
          { name: 'Generic SaaS Tools', pos: 'Affordable but require heavy customisation, integrations, and training.', strength: 'Affordable and easy to find', weakness: 'Needs heavy setup to actually fit your workflow', priceRange: '$20–$80/month' },
          { name: 'Spreadsheet Workarounds', pos: 'Familiar and flexible. Error-prone, unscalable — the primary incumbent in underserved niches.', strength: 'Free and familiar', weakness: 'Breaks down fast as the team grows', priceRange: '$0/month' }
        ],
        competitorGapNote: 'None of these are both simple AND specialised — that combination is still up for grabs.',
        findings: [
          { headline: 'Vertical SaaS is growing more than twice as fast as generic tools.', body: 'Niche-specific software is expanding at roughly 2.4× the rate of horizontal platforms. Buyers increasingly prefer tools built for their exact workflow over broad, configurable ones.' },
          { headline: 'The $50–$200/month tier is structurally underserved.', body: 'Most available tools are either too basic to be useful or too complex to justify the price. A well-scoped product in this range faces meaningfully less direct competition.' },
          { headline: 'Buyers evaluate software on their own now.', body: 'Trust is built through free trials and transparent pricing rather than sales conversations. Tools that hide pricing or require a demo lose a large share of self-serve buyers before they even start.' },
          { headline: 'Onboarding speed determines retention.', body: 'A significant share of customers churn within the first month if the product doesn\'t prove value quickly. The first session, not the feature list, is often what decides renewal.' },
          { headline: 'Depth beats breadth for early-stage products.', body: 'Solving one workflow extremely well outperforms trying to do everything adequately. The biggest opportunity for a new entrant is disciplined focus, not feature parity with incumbents.' }
        ],
        evidence: [{ pub: 'Gartner Software Report', snippet: 'Vertical SaaS growing at 24% CAGR vs 11% for horizontal platforms through 2027', confidence: '92%' }, { pub: 'Bessemer Venture Partners', snippet: 'SMB SaaS ARR multiples highest in vertical-specific segments globally', confidence: '85%' }, { pub: 'IDC Cloud Index', snippet: '$1.1T in global software spending projected for 2027', confidence: '90%' }],
        sourcesMore: [
          { pub: 'OpenView SaaS Benchmarks 2025', snippet: 'Median free-to-paid conversion rate for self-serve vertical SaaS is 3.7× higher than horizontal peers', confidence: '81%' },
          { pub: 'ProfitWell Retention Report', snippet: 'SaaS products with sub-5-minute time-to-first-value show 40% lower month-one churn', confidence: '84%' },
          { pub: 'G2 Software Buyer Behavior Study', snippet: '82% of SMB buyers now complete evaluation before ever speaking to sales', confidence: '87%' },
          { pub: 'a16z State of Vertical SaaS', snippet: 'Vertical SaaS companies reach $1M ARR 35% faster on average than horizontal counterparts', confidence: '83%' },
          { pub: 'Stripe SaaS Growth Index', snippet: 'Self-serve pricing transparency correlates with 18% higher trial signup rates', confidence: '78%' }
        ]
      },
      trades: {
        overview: 'The skilled trades and services sector is experiencing robust demand driven by housing activity, infrastructure investment, and ageing property stock. Operators who invest in professional branding and digital presence command 25–40% price premiums over equivalently skilled competitors. The market is large, fragmented, and structurally underbranded — making trust-led differentiation both achievable and durable.',
        trend: { icon: '🏗️', headline: 'Brand Trust Is the New Pricing Power', body: 'Tradespeople with strong online reviews and professional presentation are booking out 6–8 weeks in advance while unbranded competitors compete on price — a gap that is widening, not narrowing.' },
        marketSize: { figure: '$9.4M', interpretation: 'Plenty of local demand — the real opportunity is standing out, not finding customers.' },
        marketTable: [
          { dim: 'Market Size', finding: '$9.4M in estimated local annual demand across your trade category — the constraint is visibility, not customer volume.', confidence: '84%' },
          { dim: 'Booking Advantage', finding: '6–8 weeks average lead time for tradespeople with strong reviews, compared to next-day availability for unbranded competitors.', confidence: '83%' },
          { dim: 'Price Premium', finding: '25–40% premium commanded by professionally branded operators over equivalently skilled, unbranded competitors.', confidence: '81%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'The trades sector has a significant trust deficit — most operators rely entirely on word of mouth with no owned marketing presence. Building a consistent brand presence creates a durable competitive moat that the majority of competitors cannot quickly or cheaply replicate.',
          action: 'Invest in a professional look — reviews, photos, a simple website — most competitors haven\'t bothered, so it\'s an easy way to stand out.',
          reasons: [
            'Most sole traders rely entirely on word-of-mouth and have never invested a dollar in owned marketing, leaving the trust layer completely open.',
            'National franchises have brand recognition but feel impersonal and are often slower to respond than a local independent.',
            'Online marketplaces create lead volume but actively strip out differentiation by forcing price-based comparison.'
          ],
          oppTable: [
            { opportunity: 'Google Business Profile + review system', size: '2–3× more inbound leads', difficulty: 'Low' },
            { opportunity: 'Before/after photo portfolio + simple site', size: '25–40% quoted price premium', difficulty: 'Low' },
            { opportunity: 'Referral incentive program for past clients', size: '15–20% of new leads from referrals', difficulty: 'Medium' }
          ]
        },
        buyers: {
          chips: ['Ages 35–60', 'Homeowners', 'Mid to high income', 'Decide slowly, trust deeply'],
          driver: 'These customers are nervous about getting ripped off. They take longer to decide, but once they trust you, they stick with you and tell everyone they know.',
          psychographics: [
            { label: 'Proof Over Pitch', desc: 'They want proof before they call — reviews and photos matter more than a sales pitch.' },
            { label: 'Safety Over Savings', desc: 'They\'re not looking for the cheapest quote, they\'re looking for the safest choice.' },
            { label: 'Slow to Decide, Loyal After', desc: 'They decide slowly but refer generously once they trust someone.' },
            { label: 'Remembers the Experience', desc: 'They remember how it felt to deal with you as much as the quality of the work.' }
          ],
          demoTable: [
            { age: '35–45', revenueRange: '$70K–$110K household income', percentShare: '28%' },
            { age: '46–60', revenueRange: '$90K–$160K household income', percentShare: '49%' },
            { age: '60+', revenueRange: '$60K–$120K household income', percentShare: '23%' }
          ]
        },
        competitors: [
          { name: 'National Service Franchises', pos: 'Consistent systems and recognition. Expensive, impersonal, slow to respond.', strength: 'Trusted name, easy to find', weakness: 'Expensive and impersonal', priceRange: '$150–$400/hour' },
          { name: 'Online Marketplaces', pos: 'High discoverability. Race-to-bottom pricing pressure, no brand loyalty.', strength: 'Lots of leads, easy comparisons', weakness: 'Race to the cheapest quote, no loyalty', priceRange: '$60–$120/hour' },
          { name: 'Unbranded Sole Traders', pos: 'Lower overhead. No digital presence, no trust signals, no repeat business infrastructure.', strength: 'Cheaper, flexible scheduling', weakness: 'No way to check if they\'re trustworthy', priceRange: '$50–$100/hour' }
        ],
        competitorGapNote: 'None of these are both affordable AND clearly trustworthy — that gap is wide open.',
        findings: [
          { headline: 'Reviews translate directly into booking pressure.', body: 'Tradespeople with strong online reviews are booking 6–8 weeks ahead of unbranded competitors. That lead time itself becomes a trust signal, reinforcing the advantage further.' },
          { headline: 'Branded operators charge meaningfully more for identical work.', body: 'Professional presentation supports price premiums of up to 28% for the same job scope. Homeowners are effectively paying for confidence, not additional skill.' },
          { headline: 'Trust beats price as the top selection factor.', body: 'Communication quality and perceived trustworthiness outrank price as the number one reason homeowners choose a tradesperson. This makes responsiveness a genuine competitive lever, not just good service.' },
          { headline: 'Most competitors have no digital presence at all.', body: 'A simple, professional website remains a real differentiator in this category because so few competitors have one. Even modest investment here creates outsized relative advantage.' },
          { headline: 'Being the safe choice is the biggest open opportunity.', body: 'In a market full of unknowns, homeowners gravitate toward whoever removes the most risk from their decision. Positioning as the reliable, well-reviewed option is more valuable than positioning as the cheapest.' }
        ],
        evidence: [{ pub: 'BCI Construction Analytics', snippet: 'Branded trade operators charge 28% premium on average residential jobs vs unbranded peers', confidence: '83%' }, { pub: 'Google Business Insights NZ', snippet: 'Trades businesses with 4.5+ star rating convert 3× more inbound leads', confidence: '88%' }, { pub: 'Statista Home Services', snippet: 'Home services market growing at 6.1% annually, driven by urban property demand', confidence: '86%' }],
        sourcesMore: [
          { pub: 'HiPages Trade Pricing Report 2025', snippet: 'Homeowners rank clear communication above price in 71% of trade service decisions', confidence: '82%' },
          { pub: 'Houzz Renovation Barometer', snippet: 'Photo portfolios increase quote request rate by 2.4× for residential trades', confidence: '80%' },
          { pub: 'Nextdoor Local Business Trends', snippet: 'Neighbourhood referrals account for 38% of new trade service bookings', confidence: '77%' },
          { pub: 'ServiceTitan Home Services Benchmark', snippet: 'Businesses responding to inquiries within 1 hour convert 60% more leads', confidence: '85%' },
          { pub: 'Checkatrade Consumer Trust Survey', snippet: '89% of homeowners check reviews before requesting a quote from a tradesperson', confidence: '87%' }
        ]
      },
      other: {
        overview: 'Your market sector is showing consistent growth driven by shifting consumer preferences and accelerating digital adoption. Businesses that invest in brand clarity and customer-centric positioning are capturing disproportionate share. Independent operators with a clearly defined niche are consistently outperforming generalist competitors on both retention and margin.',
        trend: { icon: '📊', headline: 'Niche Positioning Drives Premium Pricing', body: 'Businesses with a clearly defined customer and a differentiated value proposition command 20–30% higher prices and report meaningfully lower customer acquisition costs than category generalists.' },
        marketSize: { figure: '$5.1M', interpretation: 'Big enough to build something real, small enough that a clear niche can win quickly.' },
        marketTable: [
          { dim: 'Market Size', finding: '$5.1M in estimated addressable revenue in your category — sized well for a focused, independent operator.', confidence: '80%' },
          { dim: 'Price Premium', finding: '20–30% higher prices commanded by businesses with a clearly defined customer and differentiated positioning.', confidence: '82%' },
          { dim: 'Confidence Index', finding: 'Independent operator confidence sits at a 5-year high entering 2026, signalling durable category momentum.', confidence: '85%' }
        ],
        gap: {
          headline: 'Your opportunity',
          body: 'Most businesses in this space compete on features or price without owning a clear point of view. The gap is in consistent, trust-building communication — businesses that show up reliably with relevant content build the relationships that convert and retain.',
          action: 'Pick a specific type of customer to become known for, instead of trying to serve everyone.',
          reasons: [
            'Established generalists rely on legacy brand recognition rather than active, ongoing communication with customers.',
            'Low-cost alternatives compete purely on price, which erodes the relationship the moment a cheaper option appears.',
            'Very few competitors show up consistently with relevant content, so trust has to be rebuilt at every single interaction.'
          ],
          oppTable: [
            { opportunity: 'Niche-specific positioning and messaging', size: '20–30% pricing premium over generalists', difficulty: 'Low' },
            { opportunity: 'Consistent content cadence (weekly/monthly)', size: '15–25% lower customer acquisition cost', difficulty: 'Medium' },
            { opportunity: 'Referral or loyalty program for repeat buyers', size: '10–20% of revenue from repeat customers', difficulty: 'Medium' }
          ]
        },
        buyers: {
          chips: ['Ages 28–50', 'Mid income', 'Solving a specific problem', 'Value-conscious'],
          driver: 'These customers have a problem they can\'t solve alone. They\'re not looking for the flashiest option — they want to feel confident they picked someone who gets it.',
          psychographics: [
            { label: 'Wants a True Specialist', desc: 'They want a specialist who clearly understands their exact problem.' },
            { label: 'Loyal Once Trust is Earned', desc: 'They stick with a business once trust is earned, rather than shopping around every time.' },
            { label: 'Refers When Solved', desc: 'They talk about businesses that solved a real problem for them, driving referrals.' },
            { label: 'Values Expertise Over Price', desc: 'They choose expertise and reliability over the cheapest available option.' }
          ],
          demoTable: [
            { age: '28–38', revenueRange: '$50K–$85K household income', percentShare: '33%' },
            { age: '38–50', revenueRange: '$85K–$130K household income', percentShare: '42%' },
            { age: '50–65', revenueRange: '$60K–$100K household income', percentShare: '25%' }
          ]
        },
        competitors: [
          { name: 'Established Generalists', pos: 'Wide range and brand recognition. No clear niche depth or differentiated story.', strength: 'Known name, wide range', weakness: 'No clear specialty, feels generic', priceRange: 'Mid-market pricing' },
          { name: 'Low-Cost Alternatives', pos: 'Price-competitive. Sacrifice quality, relationship, and long-term customer value.', strength: 'Cheapest option available', weakness: 'No loyalty, customers leave for any discount', priceRange: 'Below-market pricing' },
          { name: 'Enterprise Providers', pos: 'High capability. Often inaccessible in price and responsiveness to smaller buyers.', strength: 'Deep capability and credibility', weakness: 'Too expensive and slow for smaller buyers', priceRange: 'Premium pricing' }
        ],
        competitorGapNote: 'None of these have a clear point of view — being specific is still a real advantage here.',
        findings: [
          { headline: 'Niche-focused businesses consistently outperform generalists.', body: 'Retention and margin both run higher for operators with a clearly defined customer than for competitors trying to serve everyone. The advantage compounds over time as trust deepens with a specific audience.' },
          { headline: 'Most competitors still compete on price alone.', body: 'Very few businesses in this category have built a genuine point of view, which leaves messaging largely undifferentiated. This creates real room for a business willing to say something specific.' },
          { headline: 'Consistent communication is the biggest structural gap.', body: 'Most competitors show up inconsistently, forcing customers to rebuild trust every time they engage. Regular, relevant content is one of the most under-used levers in this category.' },
          { headline: 'Specialist positioning converts noticeably better.', body: 'Businesses that clearly define who they serve see close to a 30% lift in first-contact conversion versus generalist messaging. The clarity itself does much of the persuasive work.' },
          { headline: 'Being known for one thing beats being good at everything.', body: 'The biggest open opportunity is a sharper, more specific identity rather than a broader one. Customers remember and refer specialists far more readily than generalists.' }
        ],
        evidence: [{ pub: 'Business Strategy Review', snippet: 'Niche-focused businesses outperform generalists on NPS and annual retention rates', confidence: '81%' }, { pub: 'Deloitte SMB Report', snippet: 'Brand investment ROI averages 3.7× for small businesses with under 50 employees', confidence: '79%' }, { pub: 'Statista Business Trends', snippet: 'Independent operator confidence index at 5-year high entering 2026', confidence: '85%' }],
        sourcesMore: [
          { pub: 'Edelman Trust Barometer SMB Edition', snippet: 'Specialist positioning increases first-contact conversion by 29% vs generalist competitors', confidence: '82%' },
          { pub: 'HubSpot Small Business Trends 2025', snippet: 'Businesses publishing content weekly see 3.2× more inbound leads than inconsistent publishers', confidence: '78%' },
          { pub: 'Nielsen Small Business Sentiment Index', snippet: 'Referral-driven customers show 45% higher lifetime value than paid-acquisition customers', confidence: '80%' },
          { pub: 'McKinsey SMB Growth Playbook', snippet: 'Clear positioning reduces customer acquisition cost by up to 25% across service categories', confidence: '83%' },
          { pub: 'Salesforce Small Business Trends Report', snippet: '72% of small business buyers say consistent communication influences their loyalty', confidence: '76%' }
        ]
      }
    },
    customers: {
      food: {
        demographics: { chips: ['Ages 25–45', 'Mid–High Income', 'Urban Dwellers', 'Values Local'], summary: 'Urban and suburban adults who actively seek out quality-led food experiences. Skew toward women, dual-income households, and social buyers who use food as a form of self-expression and gifting.', table: [{ age: '25–34', revenueRange: '$55K–$85K household income', percentShare: '30%' }, { age: '35–50', revenueRange: '$85K–$130K household income', percentShare: '47%' }, { age: '50–65', revenueRange: '$60K–$100K household income', percentShare: '23%' }] },
        personas: [{ name: 'Maya Chen', age: 32, role: 'Marketing Coordinator', desc: 'Follows three local food accounts and plans her weekend around the farmers market.', wtpRange: '$15–$35 per visit' }, { name: 'Daniel Osei', age: 41, role: 'Restaurant-Curious Dad', desc: 'Buys premium ingredients for weekend cooking projects with his kids.', wtpRange: '$25–$60 per visit' }],
        jtbd: ['When I want to treat myself without guilt, I buy from a local artisan so I feel good about the indulgence.', 'When I\'m hosting people I care about, I buy premium local food so I feel proud of what I serve.', 'When I want to connect with my community, I shop at local markets so I feel part of something meaningful.'],
        jtbdTable: [{ job: 'Find food I can trust the origin of', type: 'Functional', importance: 9, satisfaction: 5 }, { job: 'Feel good about supporting a local business', type: 'Emotional', importance: 8, satisfaction: 6 }, { job: 'Treat myself without derailing my budget', type: 'Functional', importance: 7, satisfaction: 6 }, { job: 'Share something impressive when hosting', type: 'Social', importance: 7, satisfaction: 4 }, { job: 'Discover new flavors before my friends do', type: 'Social', importance: 6, satisfaction: 5 }],
        journey: [{ stage: 'Awareness', goal: 'Discover a food option that feels different from the usual chains', channel: 'Instagram / local market signage', friction: 'Hard to tell quality apart from a photo alone', kpi: 'Reach & saves' }, { stage: 'Consideration', goal: 'Confirm quality, provenance, and price are worth it', channel: 'Instagram profile / Google reviews', friction: 'Limited proof beyond photos and captions', kpi: 'Profile visits, review reads' }, { stage: 'Decision', goal: 'Commit to trying it for the first time', channel: 'In-person / online order', friction: 'First-time price anxiety', kpi: 'First-order conversion rate' }, { stage: 'Purchase', goal: 'Have a smooth, satisfying transaction', channel: 'In-store / delivery app', friction: 'Wait times, stock availability', kpi: 'Checkout completion' }, { stage: 'Loyalty', goal: 'Feel like a recognized regular', channel: 'Email / SMS / in-person recognition', friction: 'No reason to come back beyond taste alone', kpi: 'Repeat purchase rate' }],
        triggers: ['Fear of missing out', 'Community belonging', 'Pride in supporting local', 'Treating themselves', 'Health consciousness'],
        drivers: [{ factor: 'Verified local provenance', weight: 9, quote: 'If I can see where it actually came from, I don\'t even look at the price.' }, { factor: 'Founder or maker story', weight: 8, quote: 'I want to know there\'s a real person behind this, not just a brand.' }, { factor: 'Visual appeal / packaging', weight: 7, quote: 'I decide in about three seconds based on how it looks.' }, { factor: 'Friend or influencer recommendation', weight: 7, quote: 'If someone I trust posts about it, I\'m already halfway convinced.' }],
        barriers: [{ factor: 'Price relative to supermarket', weight: 8, quote: 'It\'s hard to justify paying double for something that looks similar.' }, { factor: 'Uncertainty about quality consistency', weight: 6, quote: 'One bad experience and I probably won\'t come back.' }, { factor: 'Inconvenient location or hours', weight: 6, quote: 'I want to support them but the timing never works for me.' }, { factor: 'Unclear ingredient or allergy info', weight: 5, quote: 'If I can\'t tell what\'s in it, I just won\'t risk it.' }],
        wtp: { position: 62, label: 'Mid–High', spend: '$15–$45 per transaction', priority: 'quality and provenance over lowest price' },
        segments: [{ name: 'The Weekend Treater', size: '58%', wtp: '$15–$25 per visit', retention: 'Comes back often if the experience feels special', attractiveness: 'High', triggers: ['A limited-batch or seasonal item they don\'t want to miss.', 'A social occasion worth treating themselves for.', 'A recommendation from someone they follow online.'] }, { name: 'The Everyday Local', size: '42%', wtp: '$8–$15 per visit', retention: 'Very loyal once you\'re part of their routine', attractiveness: 'Medium', triggers: ['Convenience combined with consistently good quality.', 'Feeling recognized as a regular.', 'A routine that fits naturally into their week.'] }],
        evidence: [{ pub: 'Mintel Food & Drink Report', snippet: '72% of premium food buyers cite provenance as key purchase driver', confidence: '88%' }, { pub: 'Nielsen Consumer Panel', snippet: 'Repeat purchase rate 2.3× higher when brand has clear local story', confidence: '85%' }, { pub: 'Food Standards Australia NZ', snippet: 'Artisan food purchase frequency up 31% among 25–45 age group in 2025', confidence: '79%' }],
        sourcesMore: [{ pub: 'Instagram Business Insights', snippet: 'Food posts featuring the maker or process see 2.1× higher save rates', confidence: '75%' }, { pub: 'Toast Restaurant Trends 2025', snippet: 'First-time visit conversion up 18% when provenance is stated on the menu', confidence: '77%' }, { pub: 'Google Consumer Insights', snippet: '"Who makes this" search queries for local food up 26% year-over-year', confidence: '74%' }, { pub: 'Yelp Local Trends Report', snippet: 'Reviews mentioning "authentic" or "local" correlate with 22% higher repeat visit rate', confidence: '78%' }, { pub: 'Square Restaurant Benchmark', snippet: 'Loyalty program members spend 34% more per visit than non-members', confidence: '80%' }]
      },
      retail: {
        demographics: { chips: ['Ages 30–50', 'Dual Income', 'Suburban', 'Research-Led'], summary: 'Mid-career adults in dual-income households who research purchases carefully. Motivated by value alignment and brand story as much as product quality — and highly likely to become brand advocates when expectations are exceeded.', table: [{ age: '25–34', revenueRange: '$65K–$95K household income', percentShare: '28%' }, { age: '35–50', revenueRange: '$95K–$150K household income', percentShare: '49%' }, { age: '50–65', revenueRange: '$75K–$120K household income', percentShare: '23%' }] },
        personas: [{ name: 'Priya Nair', age: 34, role: 'Product Manager', desc: 'Reads at least 5 reviews before adding anything to her cart.', wtpRange: '$40–$100 per order' }, { name: 'Tom Whitfield', age: 47, role: 'Small Business Owner', desc: 'Buys premium once he trusts a brand, then rarely switches.', wtpRange: '$80–$180 per order' }],
        jtbd: ['When I need to replace something important, I research carefully so I feel confident I made the right choice.', 'When I discover a brand that aligns with my values, I buy more so I can feel like a supporter, not just a customer.', 'When I find a quality product I love, I tell my friends so I become the person who finds good things first.'],
        jtbdTable: [{ job: 'Feel confident I\'m not overpaying for quality', type: 'Functional', importance: 8, satisfaction: 5 }, { job: 'Find a brand that matches my values', type: 'Emotional', importance: 7, satisfaction: 5 }, { job: 'Avoid the hassle of returns or a bad fit', type: 'Functional', importance: 8, satisfaction: 6 }, { job: 'Be the first among friends to find something great', type: 'Social', importance: 6, satisfaction: 4 }, { job: 'Trust the brand will still be around in a year', type: 'Emotional', importance: 6, satisfaction: 5 }],
        journey: [{ stage: 'Awareness', goal: 'Discover an alternative to the usual mass-market options', channel: 'Instagram / Pinterest ads, search', friction: 'Ad fatigue and skepticism toward paid promotion', kpi: 'Click-through rate' }, { stage: 'Consideration', goal: 'Verify quality and brand legitimacy', channel: 'Reviews, website, social proof', friction: 'Uncertainty without in-person inspection', kpi: 'Review reads, time on site' }, { stage: 'Decision', goal: 'Commit to the purchase with confidence', channel: 'Checkout page / email retargeting', friction: 'Shipping cost or return policy concerns', kpi: 'Cart-to-purchase conversion' }, { stage: 'Purchase', goal: 'Receive a product that matches expectations', channel: 'Delivery / unboxing experience', friction: 'Delivery delays, packaging quality', kpi: 'Fulfillment satisfaction' }, { stage: 'Loyalty', goal: 'Feel like a valued repeat customer', channel: 'Email / loyalty program', friction: 'No compelling reason to return before needing to repurchase', kpi: 'Repeat purchase rate' }],
        triggers: ['Value for money', 'Social proof', 'Brand alignment', 'Discovery joy', 'Gifting instinct'],
        drivers: [{ factor: 'Clear brand story / values', weight: 8, quote: 'I want to know what a brand stands for before I hand over my card.' }, { factor: 'Social proof (reviews, UGC)', weight: 8, quote: 'If nobody else is talking about it, I get nervous.' }, { factor: 'Return policy clarity', weight: 7, quote: 'I won\'t buy if I can\'t easily send it back.' }, { factor: 'Visual consistency across channels', weight: 6, quote: 'If the website looks different from the ad, I get suspicious.' }],
        barriers: [{ factor: 'Shipping cost / delivery time', weight: 7, quote: 'An extra week of waiting makes me second-guess the purchase.' }, { factor: 'Unfamiliar brand, no track record', weight: 7, quote: 'I\'ve been burned by a small brand before, so I\'m cautious now.' }, { factor: 'Price relative to known alternatives', weight: 6, quote: 'I always check if a big retailer has something similar for less.' }, { factor: 'Sizing / fit uncertainty', weight: 5, quote: 'If I can\'t try it on, I\'m worried it\'ll be wrong.' }],
        wtp: { position: 48, label: 'Mid', spend: '$40–$120 per transaction', priority: 'perceived value and quality over the lowest price' },
        segments: [{ name: 'The Value Researcher', size: '64%', wtp: '$40–$80 per order', retention: 'Loyal once trust is earned, but will compare first', attractiveness: 'Medium', triggers: ['Clear reviews and a values-aligned brand story.', 'A limited-time discount that removes hesitation.', 'A friend\'s recommendation that adds trust.'] }, { name: 'The Occasional Splurge', size: '36%', wtp: '$100–$200 per order', retention: 'Buys less often but spends more when they do', attractiveness: 'High', triggers: ['A special occasion or milestone worth marking.', 'A product that feels like a genuine investment.', 'Exclusive or limited-edition availability.'] }],
        evidence: [{ pub: 'Retail Intelligence Quarterly', snippet: 'Brand loyalty 41% higher among DTC customers vs marketplace buyers', confidence: '86%' }, { pub: 'Shopify Commerce Report 2025', snippet: 'Average order value 28% higher when brand story prominently featured', confidence: '83%' }, { pub: 'Deloitte Consumer Pulse', snippet: '58% of independent retail customers return within 60 days when experience met expectations', confidence: '80%' }],
        sourcesMore: [{ pub: 'Trustpilot Consumer Trust Report', snippet: 'Shoppers read an average of 5.3 reviews before completing a first-time purchase', confidence: '81%' }, { pub: 'Klarna Shopping Behavior Study', snippet: 'Clear return policies increase checkout completion by 19%', confidence: '78%' }, { pub: 'Meta Commerce Insights', snippet: 'UGC-featuring ads convert 22% better than studio product photography alone', confidence: '76%' }, { pub: 'Narvar Post-Purchase Report', snippet: 'Unboxing experience quality correlates with a 15% lift in repeat purchase rate', confidence: '75%' }, { pub: 'Yotpo Loyalty Benchmark', snippet: 'Loyalty program members have a 3.2× higher repeat purchase rate than non-members', confidence: '80%' }]
      },
      creative: {
        demographics: { chips: ['Ages 30–50', 'Business Owners', 'Time-Poor', 'Growth Focused'], summary: 'Founders and marketing managers at growing SMBs who need creative output but lack the in-house capacity to produce it. They buy on trust, chemistry, and confidence — not just portfolio.', table: [{ age: '28–38', revenueRange: '$250K–$800K annual business revenue', percentShare: '38%' }, { age: '38–50', revenueRange: '$800K–$3M annual business revenue', percentShare: '44%' }, { age: '50–60', revenueRange: '$3M+ annual business revenue', percentShare: '18%' }] },
        personas: [{ name: 'Sarah Kim', age: 35, role: 'Marketing Director', desc: 'Manages a stretched team and needs creative partners who can just run with a brief.', wtpRange: '$3,000–$8,000 per project' }, { name: 'James Okafor', age: 44, role: 'Founder, Growth-Stage Startup', desc: 'Wants his brand to look like it belongs at the next funding stage.', wtpRange: '$5,000–$15,000 per project' }],
        jtbd: ['When I need to refresh my brand, I hire a creative studio so I can feel confident in how we show up.', 'When I\'m launching something important, I want creative support so it lands the way I\'ve imagined it.', 'When my in-house team is stretched, I bring in specialists so I can move faster without sacrificing quality.'],
        jtbdTable: [{ job: 'Look credible to investors and customers fast', type: 'Emotional', importance: 8, satisfaction: 5 }, { job: 'Get creative work done without micromanaging', type: 'Functional', importance: 9, satisfaction: 5 }, { job: 'Avoid another agency relationship that fizzles', type: 'Emotional', importance: 7, satisfaction: 4 }, { job: 'Prove marketing spend drove real results', type: 'Functional', importance: 8, satisfaction: 5 }, { job: 'Feel proud showing the work to my team or board', type: 'Social', importance: 6, satisfaction: 5 }],
        journey: [{ stage: 'Awareness', goal: 'Realize current creative isn\'t working or doesn\'t exist', channel: 'Referral, LinkedIn content', friction: 'Not sure if the problem is strategy or execution', kpi: 'Inbound inquiries' }, { stage: 'Consideration', goal: 'Find a partner who understands the business, not just aesthetics', channel: 'Portfolio site, case studies, discovery call', friction: 'Hard to evaluate quality without seeing outcomes', kpi: 'Proposal requests' }, { stage: 'Decision', goal: 'Commit budget with confidence in the outcome', channel: 'Proposal / scoping call', friction: 'Fear of scope creep or missed deadlines', kpi: 'Proposal-to-signed rate' }, { stage: 'Delivery', goal: 'See the work reflect the brief and the brand', channel: 'Project check-ins, revisions', friction: 'Miscommunication during revision rounds', kpi: 'Revision cycles to approval' }, { stage: 'Loyalty', goal: 'Keep the same partner for the next project', channel: 'Ongoing retainer / referral', friction: 'No clear proof the work moved the needle', kpi: 'Repeat engagement rate' }],
        triggers: ['Fear of looking amateur', 'Trust in specialist', 'Deadline pressure', 'Pride in output', 'Status signalling'],
        drivers: [{ factor: 'Demonstrated business outcomes', weight: 9, quote: 'Show me it worked somewhere else, not just that it looks nice.' }, { factor: 'Chemistry / communication style', weight: 8, quote: 'I need someone I can be direct with, not someone I have to manage.' }, { factor: 'Speed to first draft', weight: 7, quote: 'If I\'m waiting three weeks for a first look, I\'m already anxious.' }, { factor: 'Referral from someone I trust', weight: 8, quote: 'A referral skips most of my usual vetting process.' }],
        barriers: [{ factor: 'Fear of scope creep / hidden costs', weight: 8, quote: 'The quote never seems to be the final number.' }, { factor: 'Past bad experience with an agency', weight: 7, quote: 'I got burned once and now I over-scrutinize everyone.' }, { factor: 'Uncertainty about ROI', weight: 7, quote: 'I can\'t always tie creative spend to a number I can defend.' }, { factor: 'Timeline risk around launches', weight: 6, quote: 'If this slips, it\'s not just annoying, it delays a whole launch.' }],
        wtp: { position: 78, label: 'High', spend: '$2,000–$15,000 per project', priority: 'quality, speed, and creative confidence over cost' },
        segments: [{ name: 'The Growth-Stage Founder', size: '46%', wtp: '$3,000–$10,000 per project', retention: 'Becomes a repeat client if the first project delivers results', attractiveness: 'High', triggers: ['A launch or rebrand with a hard deadline.', 'Fundraising or a major milestone approaching.', 'Feeling behind competitors on brand polish.'] }, { name: 'The Overstretched Marketer', size: '54%', wtp: '$1,500–$4,000 per project', retention: 'Keeps coming back for ongoing support', attractiveness: 'Medium', triggers: ['Their in-house team is too stretched to take on more.', 'A backlog of content requests piling up.', 'Leadership asking for more output without more headcount.'] }],
        evidence: [{ pub: 'Clutch B2B Services Survey', snippet: '71% of creative buyers chose their provider based on a personal referral', confidence: '87%' }, { pub: 'HubSpot Agency Report 2025', snippet: 'Average project value up 22% for studios with defined process documentation', confidence: '82%' }, { pub: 'LinkedIn Professional Insights', snippet: 'Decision-maker trust in creative partner established within first 2 touchpoints', confidence: '78%' }],
        sourcesMore: [{ pub: 'Bonsai Freelance Economy Report', snippet: 'Clients citing "clear process" as a top decision factor increased 16% year-over-year', confidence: '76%' }, { pub: 'Databox Agency Benchmark', snippet: 'Agencies presenting outcome metrics in proposals close 27% more new business', confidence: '79%' }, { pub: 'HoneyBook SMB Services Survey', snippet: '64% of small business buyers rank responsiveness above price when hiring a creative partner', confidence: '77%' }, { pub: 'Dribbble Design in Tech Report', snippet: 'Referral-sourced creative engagements have 31% lower churn than cold-outreach clients', confidence: '75%' }, { pub: 'LinkedIn B2B Marketing Benchmark', snippet: 'Case-study-led content drives 2.4× more qualified inbound leads than portfolio-only sites', confidence: '78%' }]
      },
      tech: {
        demographics: { chips: ['Ages 28–45', 'Founders & Ops', 'Early Adopters', 'ROI Focused'], summary: 'Startup founders and operations leads at growing companies who are comfortable evaluating software independently. They move fast, expect pricing transparency, and churn quickly if onboarding fails to deliver value.', table: [{ age: '28–35', revenueRange: '$0–$1M ARR (early-stage team)', percentShare: '29%' }, { age: '35–45', revenueRange: '$1M–$10M ARR (scaling team)', percentShare: '48%' }, { age: '45–55', revenueRange: '$10M+ ARR (established operator)', percentShare: '23%' }] },
        personas: [{ name: 'Alex Rivera', age: 31, role: 'Head of Operations', desc: 'Evaluates 3–4 tools in parallel and picks whichever proves value fastest.', wtpRange: '$50–$150/month' }, { name: 'Nina Patel', age: 39, role: 'Founder & CEO', desc: 'Outgrew a spreadsheet system and needs something her team will actually adopt.', wtpRange: '$150–$400/month' }],
        jtbd: ['When my team is wasting time on manual work, I evaluate new software so I can reclaim hours without adding headcount.', 'When I need to scale a process, I look for a tool that can grow with us so I don\'t rebuild in 12 months.', 'When a competitor moves faster, I look for tools that close the gap so I can stay ahead.'],
        jtbdTable: [{ job: 'See value within the first session', type: 'Functional', importance: 9, satisfaction: 4 }, { job: 'Avoid another failed software rollout', type: 'Emotional', importance: 8, satisfaction: 5 }, { job: 'Get the whole team actually using it', type: 'Functional', importance: 8, satisfaction: 5 }, { job: 'Justify the spend to leadership', type: 'Functional', importance: 7, satisfaction: 6 }, { job: 'Feel ahead of competitors using better tools', type: 'Social', importance: 5, satisfaction: 5 }],
        journey: [{ stage: 'Awareness', goal: 'Realize a manual process is costing real time or money', channel: 'G2, ProductHunt, peer Slack groups', friction: 'Too many similar-looking tools to evaluate', kpi: 'Trial signups' }, { stage: 'Consideration', goal: 'Confirm it solves the exact workflow, not just adjacent ones', channel: 'Free trial, docs, changelog', friction: 'Unclear fit without heavy setup or a sales call', kpi: 'Trial activation rate' }, { stage: 'Decision', goal: 'Get buy-in from the rest of the team', channel: 'Internal Slack, demo call', friction: 'Team resistance to changing tools', kpi: 'Trial-to-paid conversion' }, { stage: 'Onboarding', goal: 'Get the team fully set up without disruption', channel: 'In-app onboarding, support docs', friction: 'Migration effort from the old tool or spreadsheet', kpi: 'Time-to-first-value' }, { stage: 'Renewal', goal: 'Confirm it\'s still worth the monthly cost', channel: 'Usage reports, renewal emails', friction: 'Feature plateau, competitor outreach', kpi: 'Net revenue retention' }],
        triggers: ['Efficiency anxiety', 'Competitive pressure', 'Trust in product', 'Fear of switching costs', 'Team alignment'],
        drivers: [{ factor: 'Fast time-to-value', weight: 9, quote: 'If I don\'t get it in the first 10 minutes, I\'m out.' }, { factor: 'Transparent, simple pricing', weight: 8, quote: 'Hidden pricing is an instant red flag for me.' }, { factor: 'Responsive support / active changelog', weight: 7, quote: 'I want to see it\'s still being improved, not abandoned.' }, { factor: 'Seamless integrations', weight: 7, quote: 'It has to fit into what we already use, not replace everything.' }],
        barriers: [{ factor: 'Fear of another failed rollout', weight: 8, quote: 'We\'ve adopted tools before that nobody ended up using.' }, { factor: 'Switching cost / data migration', weight: 7, quote: 'Moving everything over always takes longer than promised.' }, { factor: 'Team resistance to change', weight: 7, quote: 'Getting five people to change habits is harder than the tool itself.' }, { factor: 'Uncertainty about long-term pricing', weight: 6, quote: 'I\'ve been burned by a tool that tripled its price after we depended on it.' }],
        wtp: { position: 44, label: 'Mid', spend: '$50–$250/month', priority: 'time-to-value and integration compatibility over pricing' },
        segments: [{ name: 'The Fast Evaluator', size: '55%', wtp: '$50–$150/month', retention: 'Churns quickly if value isn\'t obvious in week one', attractiveness: 'Medium', triggers: ['A specific workflow breaking down that needs fixing now.', 'A free trial with no credit card required.', 'A peer recommendation in a community or Slack group.'] }, { name: 'The Scaling Operator', size: '45%', wtp: '$150–$400/month', retention: 'Sticky once the tool is embedded in their process', attractiveness: 'High', triggers: ['Outgrowing a spreadsheet or a simpler tool.', 'Adding headcount that the current process can\'t support.', 'A compliance or reporting requirement the old system can\'t handle.'] }],
        evidence: [{ pub: 'G2 Software Buyer Report', snippet: 'Average SaaS evaluation cycle 2.3 weeks among SMB buyers in 2025', confidence: '89%' }, { pub: 'Tomasz Tunguz B2B Research', snippet: 'Free trial activation increases conversion 3.7× vs demo-only flows', confidence: '84%' }, { pub: 'Intercom Customer Journey Study', snippet: '68% of SaaS churn occurs within first 30 days due to onboarding friction', confidence: '86%' }],
        sourcesMore: [{ pub: 'ChartMogul SaaS Metrics Report', snippet: 'Products with sub-10-minute onboarding show 41% higher week-one retention', confidence: '82%' }, { pub: 'Slack Future of Work Study', snippet: 'Team-wide adoption is the #1 cited reason for SaaS renewal among SMBs', confidence: '78%' }, { pub: 'Vendr SaaS Buying Report', snippet: 'Transparent public pricing pages increase trial-to-paid conversion by 24%', confidence: '80%' }, { pub: 'Zapier State of Business Automation', snippet: 'Integration compatibility ranked the #2 evaluation criterion after price by SMB buyers', confidence: '77%' }, { pub: 'ProfitWell Churn Analysis', snippet: 'Teams that complete onboarding within week one churn at less than half the rate of those that don\'t', confidence: '85%' }]
      },
      trades: {
        demographics: { chips: ['Ages 35–60', 'Homeowners', 'Mid–High Income', 'Trust-Led'], summary: 'Mid-to-senior homeowners who make high-consideration decisions based primarily on trust, reliability, and social proof. Slow to decide but highly loyal and refer freely when experience exceeds expectations.', table: [{ age: '35–45', revenueRange: '$70K–$110K household income', percentShare: '28%' }, { age: '46–60', revenueRange: '$90K–$160K household income', percentShare: '49%' }, { age: '60+', revenueRange: '$60K–$120K household income', percentShare: '23%' }] },
        personas: [{ name: 'Margaret Ellis', age: 52, role: 'Homeowner Planning a Renovation', desc: 'Wants a tradesperson she won\'t have to double-check or chase up.', wtpRange: '$800–$2,500 per job' }, { name: 'Robert Nguyen', age: 39, role: 'First-Time Homeowner', desc: 'Nervous about being overcharged and relies heavily on reviews.', wtpRange: '$300–$900 per job' }],
        jtbd: ['When something in my home needs fixing, I look for a tradesperson I can trust so I don\'t have to think about it again.', 'When I\'m planning a renovation, I want someone who communicates clearly so I feel in control of the process.', 'When a tradesperson delivers, I refer them immediately so I become the person people ask for recommendations.'],
        jtbdTable: [{ job: 'Avoid being ripped off or overcharged', type: 'Emotional', importance: 9, satisfaction: 5 }, { job: 'Get the job done right the first time', type: 'Functional', importance: 9, satisfaction: 6 }, { job: 'Feel in control of the process', type: 'Emotional', importance: 7, satisfaction: 5 }, { job: 'Not have to chase for updates', type: 'Functional', importance: 7, satisfaction: 5 }, { job: 'Have someone reliable to call again next time', type: 'Social', importance: 6, satisfaction: 6 }],
        journey: [{ stage: 'Awareness', goal: 'Realize a repair or project can\'t wait or DIY isn\'t an option', channel: 'Google search, Facebook local groups', friction: 'Overwhelmed by too many similar-looking options', kpi: 'Search impressions, profile views' }, { stage: 'Consideration', goal: 'Narrow down to a shortlist of trustworthy options', channel: 'Reviews, photo galleries, referrals', friction: 'Hard to verify quality before hiring', kpi: 'Quote requests' }, { stage: 'Decision', goal: 'Choose the safest, most trustworthy option, not just the cheapest', channel: 'Phone call / quote comparison', friction: 'Price variance across quotes causes hesitation', kpi: 'Quote-to-booking rate' }, { stage: 'Job', goal: 'Have the work completed on time and on budget', channel: 'In-person / SMS updates', friction: 'Poor communication during the job', kpi: 'On-time completion rate' }, { stage: 'Advocacy', goal: 'Feel confident recommending them to others', channel: 'Word of mouth / Google review', friction: 'Never asked for a review after the job', kpi: 'Review volume, referral rate' }],
        triggers: ['Trust in tradesperson', 'Fear of being ripped off', 'Home pride', 'Convenience', 'Neighbourhood reputation'],
        drivers: [{ factor: 'Verified reviews / star rating', weight: 9, quote: 'If they don\'t have reviews, I assume the worst.' }, { factor: 'Clear, upfront pricing', weight: 8, quote: 'I want to know the number before they walk in the door.' }, { factor: 'Photos of past work', weight: 7, quote: 'Before and after photos tell me more than any pitch.' }, { factor: 'Fast response to enquiry', weight: 7, quote: 'If they take three days to reply, I\'ve already called someone else.' }],
        barriers: [{ factor: 'Fear of being overcharged', weight: 8, quote: 'I\'ve heard too many stories about tradespeople padding the bill.' }, { factor: 'No way to verify trustworthiness', weight: 7, quote: 'Anyone can put up a sign, I need more proof than that.' }, { factor: 'Inconsistent availability / scheduling', weight: 6, quote: 'If I can\'t get a straight answer on timing, I get nervous.' }, { factor: 'Unclear scope of work', weight: 6, quote: 'I don\'t want surprises added to the invoice halfway through.' }],
        wtp: { position: 52, label: 'Mid', spend: '$300–$2,500 per job', priority: 'reliability and trust over getting the cheapest quote' },
        segments: [{ name: 'The Careful Homeowner', size: '62%', wtp: '$500–$2,000 per job', retention: 'Extremely loyal and refers often once trust is built', attractiveness: 'High', triggers: ['A recommendation from someone they trust, or strong reviews.', 'A renovation or planned project with a flexible timeline.', 'Clear, itemized quotes that build confidence.'] }, { name: 'The Urgent Fix Seeker', size: '38%', wtp: '$200–$800 per job', retention: 'Books again if the response was fast and reliable', attractiveness: 'Medium', triggers: ['Something broke and they need it handled immediately.', 'Fast response time to their initial enquiry.', 'Availability that matches their urgency.'] }],
        evidence: [{ pub: 'HiPages Trade Services Report', snippet: '86% of homeowners would pay a premium for a tradesperson with verified reviews', confidence: '88%' }, { pub: 'Houzz Renovation Trends 2025', snippet: 'Average renovation budget up 18% when homeowner had prior positive trade experience', confidence: '83%' }, { pub: 'Google Local Services Data', snippet: 'Tradespeople with photo galleries receive 2.4× more quote requests', confidence: '85%' }],
        sourcesMore: [{ pub: 'Angi Home Services Survey', snippet: 'Homeowners contact an average of 2.8 tradespeople before booking one', confidence: '79%' }, { pub: 'BrightLocal Consumer Review Survey', snippet: '87% of consumers read reviews for local services before making contact', confidence: '84%' }, { pub: 'Thumbtack Pro Insights', snippet: 'Pros who respond within 1 hour are hired 3× more often than slower responders', confidence: '81%' }, { pub: 'Consumer Reports Home Services', snippet: 'Itemized quotes reduce homeowner dispute rate by 22%', confidence: '76%' }, { pub: 'NAHB Remodeling Market Index', snippet: 'Referral-sourced tradespeople retain customers for repeat jobs at 2.1× the rate of cold leads', confidence: '80%' }]
      },
      other: {
        demographics: { chips: ['Ages 28–50', 'Mid Income', 'Problem-Solvers', 'Value Seekers'], summary: 'A broad but engaged customer base motivated by solving a specific problem. They prioritise trust and expertise when selecting a provider, and are highly likely to become repeat customers when their first experience is positive.', table: [{ age: '28–38', revenueRange: '$50K–$85K household income', percentShare: '33%' }, { age: '38–50', revenueRange: '$85K–$130K household income', percentShare: '42%' }, { age: '50–65', revenueRange: '$60K–$100K household income', percentShare: '25%' }] },
        personas: [{ name: 'Chris Bennett', age: 44, role: 'Small Business Owner', desc: 'Has a specific problem and wants a specialist who clearly gets it.', wtpRange: '$150–$400 per engagement' }, { name: 'Laura Simmons', age: 37, role: 'Household Decision-Maker', desc: 'Compares a couple of options quickly, then commits once trust is established.', wtpRange: '$80–$250 per engagement' }],
        jtbd: ['When I have a problem I can\'t solve myself, I look for a specialist so I can trust the outcome.', 'When I find a business I trust, I return without comparison shopping because the relationship matters more than the price.', 'When something works well for me, I tell others so I can help them and feel useful in my network.'],
        jtbdTable: [{ job: 'Find someone who understands my exact problem', type: 'Emotional', importance: 8, satisfaction: 5 }, { job: 'Avoid wasting money on the wrong solution', type: 'Functional', importance: 8, satisfaction: 5 }, { job: 'Feel confident I made a smart choice', type: 'Emotional', importance: 7, satisfaction: 5 }, { job: 'Get a fast, clear answer without a hard sell', type: 'Functional', importance: 7, satisfaction: 6 }, { job: 'Tell others I found someone reliable', type: 'Social', importance: 5, satisfaction: 5 }],
        journey: [{ stage: 'Awareness', goal: 'Realize the problem needs outside expertise', channel: 'Search, social media, word of mouth', friction: 'Not sure who actually specializes in this', kpi: 'Search visibility, referral mentions' }, { stage: 'Consideration', goal: 'Compare a few credible options', channel: 'Reviews, website, social proof', friction: 'Hard to tell real expertise from generic marketing', kpi: 'Inquiry rate' }, { stage: 'Decision', goal: 'Commit to the option that feels safest', channel: 'Consultation call / quote', friction: 'Uncertainty about value for the price', kpi: 'Quote-to-engagement rate' }, { stage: 'Engagement', goal: 'Get the problem solved as expected', channel: 'Direct service delivery', friction: 'Expectations mismatch mid-engagement', kpi: 'Satisfaction / completion rate' }, { stage: 'Advocacy', goal: 'Feel comfortable recommending them', channel: 'Word of mouth / review', friction: 'Never prompted to leave a review or refer', kpi: 'Referral rate' }],
        triggers: ['Problem relief', 'Trust in expert', 'Value confidence', 'Social proof', 'Word-of-mouth instinct'],
        drivers: [{ factor: 'Clear specialization / relevant expertise', weight: 8, quote: 'I want someone who\'s solved my exact problem before.' }, { factor: 'Trust signals (reviews, credentials)', weight: 7, quote: 'I look for proof before I believe any pitch.' }, { factor: 'Responsive, low-pressure communication', weight: 7, quote: 'I don\'t want to feel sold to, I want to feel helped.' }, { factor: 'Word-of-mouth recommendation', weight: 8, quote: 'If a friend vouches for them, I skip most of my research.' }],
        barriers: [{ factor: 'Uncertainty about real expertise', weight: 7, quote: 'Anyone can claim to be an expert online.' }, { factor: 'Price without clear value justification', weight: 7, quote: 'If I can\'t see what I\'m actually paying for, I hesitate.' }, { factor: 'Generic, one-size-fits-all messaging', weight: 6, quote: 'If it sounds like it could apply to anyone, I assume it\'s not really for me.' }, { factor: 'Slow or unclear response', weight: 5, quote: 'If they take too long to reply, I assume they\'re too busy or don\'t care.' }],
        wtp: { position: 46, label: 'Mid', spend: '$50–$500 per engagement', priority: 'trust and reliability over finding the cheapest option' },
        segments: [{ name: 'The Trust Seeker', size: '57%', wtp: '$100–$400 per engagement', retention: 'Stays loyal once confidence is established', attractiveness: 'High', triggers: ['A referral or clear proof the business understands their problem.', 'Consistent, expert-level content that builds confidence.', 'A track record with a similar problem to theirs.'] }, { name: 'The Price Comparer', size: '43%', wtp: '$50–$150 per engagement', retention: 'Will switch for a better deal unless value is clearly communicated', attractiveness: 'Low', triggers: ['A limited-time offer or a clear cost-saving argument.', 'A direct comparison showing better value.', 'A frustration with a previous, more expensive provider.'] }],
        evidence: [{ pub: 'Edelman Trust Barometer Business', snippet: 'Trusted brands command 23% higher purchase intent among value-conscious buyers', confidence: '82%' }, { pub: 'Nielsen Global Commerce Report', snippet: 'Word-of-mouth referrals drive 32% of first-time purchases for independent businesses', confidence: '79%' }, { pub: 'Bain & Company Loyalty Research', snippet: 'Returning customers spend 67% more than first-time buyers on average', confidence: '85%' }],
        sourcesMore: [{ pub: 'Local Consumer Review Survey', snippet: '93% of consumers say online reviews influence their choice of local business', confidence: '83%' }, { pub: 'Zendesk Customer Experience Trends', snippet: 'Fast initial response time is cited by 62% of customers as a top trust signal', confidence: '77%' }, { pub: 'American Express Customer Service Barometer', snippet: 'Customers who trust a business spend 21% more on average per engagement', confidence: '79%' }, { pub: 'Podium Local Business Report', snippet: 'Businesses responding to inquiries within an hour convert 2.1× more leads', confidence: '78%' }, { pub: 'Word of Mouth Marketing Association', snippet: 'Referred customers have a 37% higher retention rate than non-referred customers', confidence: '81%' }]
      }
    },
    competition: {
      food: {
        overview: 'Food and hospitality at the independent level is highly competitive at the commodity end — dominated by chain cafés, fast-food operators, and supermarket prepared food competing on price, speed, and convenience. At the craft end, the field thins significantly. Few operators combine genuine quality with consistent brand presence and community connection, leaving a meaningful gap for an independent with a clear identity.',
        players: [
          { name: 'Chain Café Groups', pos: 'High-volume, franchise-led café and food service operators', strength: 'Scale, location density, and brand recognition', weakness: 'No authenticity, community, or craft differentiation', desc: 'Franchise-led café and food-service operators with heavy location density.', strengths: ['Extensive footprint and locations', 'Consistent, predictable menu and pricing', 'Strong brand recognition'], weaknesses: ['No authenticity or local story', 'Impersonal, identical experience everywhere', 'Weak connection to any single community'], priceRange: '$5–$12 per item' },
          { name: 'Supermarket Deli', pos: 'Convenience food prepared in-store at major supermarket chains', strength: 'Accessibility, price, and daily foot traffic', weakness: 'Generic product, no brand story, no repeat experience', desc: 'Convenience food prepared in-store at major supermarket chains.', strengths: ['Extremely convenient, already on the shopping trip', 'Lower price point than most independents', 'High daily foot traffic'], weaknesses: ['Generic product with no story', 'Zero emotional connection to the buyer', 'No loyalty mechanism beyond convenience'], priceRange: '$4–$9 per item' },
          { name: 'Meal Kit Services', pos: 'Subscription-based meal delivery targeting home cooks', strength: 'Convenience and novelty, strong digital marketing', weakness: 'High churn, no in-person connection, commoditised offering', desc: 'Subscription-based meal delivery targeting home cooks.', strengths: ['Strong digital marketing and acquisition funnels', 'Novel, convenient format', 'Predictable recurring revenue model'], weaknesses: ['High subscriber churn rate', 'No in-person or community connection', 'Commoditised, easily substitutable offering'], priceRange: '$12–$22 per order' }
        ],
        summaryTable: [
          { player: 'Chain Café Groups', position: 'High-volume convenience leader', threat: 'Medium' },
          { player: 'Supermarket Deli', position: 'Price-driven daily convenience', threat: 'Medium' },
          { player: 'Meal Kit Services', position: 'Subscription novelty player', threat: 'Low' }
        ],
        map: { xLabel: 'Convenience', yLabel: 'Craft & Quality', competitors: [{ name: 'Chain Cafés', x: 78, y: 20 }, { name: 'Supermarket Deli', x: 86, y: 12 }, { name: 'Meal Kit Services', x: 52, y: 34 }], you: { x: 22, y: 78 } },
        whitespace: 'The high-craft, community-connected quadrant of the food market is structurally underserved. Customers who care about provenance, founder story, and the experience of buying — not just the product — have nowhere good to go at scale. The opportunity is to become the obvious choice for this audience: the brand that feels personal, stands for something, and delivers consistently.',
        whitespaceAction: 'Lead with your story in every post — where the food comes from, who makes it, and why it\'s different from the chain down the road.',
        winTable: [
          { advantage: 'Founder-led storytelling', why: 'Chains structurally cannot replicate a credible personal story', how: 'Publish weekly process and sourcing content across Instagram and in-store signage' },
          { advantage: 'Local sourcing & provenance', why: 'Customers pay a 20–35% premium once provenance is visible', how: 'Name suppliers and farms directly on packaging and menus' },
          { advantage: 'Community presence', why: 'None of the top 3 competitors build real community', how: 'Host a recurring local event or market presence monthly' }
        ],
        riskTable: [
          { risk: 'Price pressure from chains at the commodity end', likelihood: 4, impact: 3, mitigation: 'Stay clearly premium-positioned rather than competing on price' },
          { risk: 'Seasonal demand swings compress cash flow', likelihood: 3, impact: 4, mitigation: 'Introduce a subscription or pre-order model for steady revenue' },
          { risk: 'Rising ingredient and input costs', likelihood: 4, impact: 3, mitigation: 'Build pricing flexibility into menu design from the start' },
          { risk: 'Local visibility gaps hurt foot traffic', likelihood: 3, impact: 3, mitigation: 'Invest consistently in local SEO and Google Business Profile' }
        ],
        evidence: [{ pub: 'IBISWorld Food Services Report', snippet: 'Chain operators control 62% of café revenue but only 31% of preference among 25–45 demographic', confidence: '84%' }, { pub: 'Mintel Competitive Landscape NZ', snippet: 'Craft food segment growing 3× faster than mainstream grocery-prepared competitors', confidence: '88%' }, { pub: 'Food & Beverage Business Review', snippet: 'Independent operators with strong brand identity retain customers 2.8× longer', confidence: '81%' }],
        sourcesMore: [
          { pub: 'Technomic Foodservice Monitor', snippet: 'Independent café share of premium segment revenue up 6.2% year-over-year', confidence: '80%' },
          { pub: 'CGA Consumer Pulse', snippet: 'Diners cite "story behind the food" as a top-3 reason for choosing independents over chains', confidence: '77%' },
          { pub: 'QSR Magazine Industry Report', snippet: 'Chain café same-store growth flattening as independents gain share in urban centers', confidence: '75%' },
          { pub: 'Local Food Economy Index', snippet: 'Community-event-hosting food businesses show 24% higher repeat visit rate', confidence: '76%' },
          { pub: 'Datassential Menu Trends', snippet: 'Menus naming specific suppliers or farms see higher perceived value scores from diners', confidence: '78%' }
        ]
      },
      retail: {
        overview: 'The retail market bifurcates sharply. The mass-market end is dominated by large chains and e-commerce aggregators competing aggressively on price, range, and fulfilment speed. The premium, story-led end is fragmented — occupied by a mix of heritage brands and newcomers — but rarely by operators who combine genuine product quality with consistent brand storytelling. The gap between cheap-and-available and premium-and-meaningful is wider than most retailers recognise.',
        players: [
          { name: 'Mass-Market Chains', pos: 'Large format retail and e-commerce competing on price and range', strength: 'Scale, logistics, and brand recognition', weakness: 'Generic, impersonal, easily commoditised at every price point', desc: 'Large format retail and e-commerce competing on price and range.', strengths: ['Massive scale and logistics network', 'Broad product range always in stock', 'High brand recognition'], weaknesses: ['Generic and impersonal at every price point', 'Easily commoditised, no unique story', 'Little to no community connection'], priceRange: '$15–$60 per item' },
          { name: 'E-commerce Aggregators', pos: 'Marketplace platforms hosting multiple independent brands', strength: 'Discovery and convenience for price-sensitive buyers', weakness: 'No brand loyalty, race-to-bottom on price, margins crushed', desc: 'Marketplace platforms hosting multiple independent brands.', strengths: ['High discoverability for price-sensitive buyers', 'Easy comparison shopping', 'Large existing customer base'], weaknesses: ['No brand loyalty built on the platform', 'Race-to-the-bottom pricing pressure', 'Margins compressed by platform fees'], priceRange: '$10–$50 per item' },
          { name: 'Premium Lifestyle Brands', pos: 'Aspirational brands with strong aesthetics and high price points', strength: 'Brand desirability and repeat customer rates', weakness: 'Often inaccessible pricing, perceived as exclusive', desc: 'Aspirational brands with strong aesthetics and high price points.', strengths: ['Strong brand desirability', 'High repeat customer rates', 'Clear aesthetic identity'], weaknesses: ['Often inaccessible pricing for average buyers', 'Can feel exclusive or unrelatable', 'Slower customer acquisition at scale'], priceRange: '$60–$200 per item' }
        ],
        summaryTable: [
          { player: 'Mass-Market Chains', position: 'Price and range leader', threat: 'High' },
          { player: 'E-commerce Aggregators', position: 'Discovery-driven marketplace', threat: 'Medium' },
          { player: 'Premium Lifestyle Brands', position: 'Aspirational high-price niche', threat: 'Low' }
        ],
        map: { xLabel: 'Price Point', yLabel: 'Brand Story', competitors: [{ name: 'Mass-Market Chains', x: 15, y: 15 }, { name: 'E-commerce Aggregators', x: 26, y: 22 }, { name: 'Premium Brands', x: 78, y: 70 }], you: { x: 65, y: 84 } },
        whitespace: 'The premium, story-led quadrant is real but underoccupied among independent operators. Most DTC brands either compete on price or build strong stories without the operational consistency to back them up. The opportunity is in combining emotional resonance with reliable product quality — becoming the brand customers feel good choosing and confident recommending.',
        whitespaceAction: 'Show the people and values behind your brand before you show the product — that\'s what builds the loyalty chains can\'t buy.',
        winTable: [
          { advantage: 'Founder-led brand story', why: 'Story-led brands command 34% higher average transaction value', how: 'Feature the founder and values prominently across product pages and social' },
          { advantage: 'Owned community channel', why: 'Reduces paid acquisition dependency by up to 41%', how: 'Build an email list and private community from day one' },
          { advantage: 'Mid-premium accessible pricing', why: 'Bridges the gap between mass-market and inaccessible premium brands', how: 'Price just above mass-market with visible quality and story justification' }
        ],
        riskTable: [
          { risk: 'E-commerce margin pressure from large platforms', likelihood: 4, impact: 4, mitigation: 'Build a direct-to-consumer channel and owned email list early' },
          { risk: 'Over-reliance on a single acquisition channel', likelihood: 3, impact: 4, mitigation: 'Diversify across organic, email, and paid channels from the start' },
          { risk: 'Inventory risk on physical goods', likelihood: 3, impact: 3, mitigation: 'Start lean with small batch runs before scaling production' },
          { risk: 'Copycat competitors on trending products', likelihood: 3, impact: 3, mitigation: 'Lean on brand story and community, which is harder to copy than product' }
        ],
        evidence: [{ pub: 'Euromonitor Retail Landscape Report', snippet: 'Story-led independent brands command 34% higher average transaction value than category-average competitors', confidence: '86%' }, { pub: 'Shopify Merchant Intelligence 2025', snippet: 'Brands with clear founder narrative reduce paid acquisition dependency by 41%', confidence: '83%' }, { pub: 'McKinsey Consumer Segmentation', snippet: 'Premium-independent segment growing at 9.2% vs 2.1% for mass market retail', confidence: '89%' }],
        sourcesMore: [
          { pub: 'BigCommerce DTC Benchmark', snippet: 'Brands with an owned email channel see 22% lower blended customer acquisition cost', confidence: '79%' },
          { pub: 'Klaviyo Retail Growth Report', snippet: 'Email-first brands retain customers at 1.8× the rate of social-only brands', confidence: '77%' },
          { pub: 'NRF Retail Consumer Trends', snippet: '54% of shoppers say they\'d pay more for a brand whose values align with their own', confidence: '81%' },
          { pub: 'Edited Retail Market Intelligence', snippet: 'Mid-premium accessible brands are the fastest-growing price tier in independent retail', confidence: '78%' },
          { pub: 'Glossy Business of Fashion Report', snippet: 'Founder-visible brands see 19% higher social engagement than faceless competitors', confidence: '75%' }
        ]
      },
      creative: {
        overview: 'The creative services market spans an enormous range from ultra-cheap freelance marketplaces to multi-million-dollar agency retainers. The middle of the market is the most contested — where generalist studios and mid-size agencies compete on portfolio and price. The strategic end is far less crowded: few independent operators position on business outcomes rather than creative deliverables, and fewer still can combine strategic thinking with boutique-quality execution.',
        players: [
          { name: 'Large Creative Agencies', pos: 'Full-service agencies offering brand, digital, and campaign creative', strength: 'End-to-end capability and established client relationships', weakness: 'Expensive, slow, and often over-built for most SMBs', desc: 'Full-service agencies offering brand, digital, and campaign creative.', strengths: ['End-to-end capability under one roof', 'Established enterprise client relationships', 'Deep bench of specialist talent'], weaknesses: ['Expensive and slow to turn around work', 'Often over-built for SMB needs', 'Impersonal, account-manager-led relationships'], priceRange: '$15,000–$80,000 per project' },
          { name: 'Freelance Marketplaces', pos: 'Platforms connecting clients with individual designers and copywriters', strength: 'Speed, low cost, and broad talent access', weakness: 'No strategic layer, inconsistent quality, no accountability', desc: 'Platforms connecting clients with individual designers and copywriters.', strengths: ['Low cost and fast to book', 'Broad access to varied talent', 'Flexible for one-off tasks'], weaknesses: ['No strategic layer or business context', 'Inconsistent quality across providers', 'No accountability if a project underdelivers'], priceRange: '$200–$2,000 per project' },
          { name: 'Mid-Size Generalist Studios', pos: 'Boutique agencies offering brand and digital creative to SMBs', strength: 'More personal than large agencies, broader than freelancers', weakness: 'Undifferentiated, compete on price, high churn', desc: 'Boutique agencies offering brand and digital creative to SMBs.', strengths: ['More personal than a large agency', 'Broader capability than a solo freelancer', 'Established local reputation'], weaknesses: ['Undifferentiated positioning, competes on price', 'High client churn from inconsistent results', 'Rarely speaks the language of business outcomes'], priceRange: '$3,000–$15,000 per project' }
        ],
        summaryTable: [
          { player: 'Large Creative Agencies', position: 'Full-service, enterprise-scale', threat: 'Low' },
          { player: 'Freelance Marketplaces', position: 'Low-cost, execution-only', threat: 'Medium' },
          { player: 'Mid-Size Generalist Studios', position: 'Undifferentiated boutique competitor', threat: 'High' }
        ],
        map: { xLabel: 'Project Scale', yLabel: 'Strategy Integration', competitors: [{ name: 'Large Agencies', x: 84, y: 65 }, { name: 'Freelance Marketplaces', x: 15, y: 12 }, { name: 'Mid-Size Studios', x: 50, y: 34 }], you: { x: 36, y: 82 } },
        whitespace: 'The boutique-strategic quadrant — where studios deliver business-outcome-focused creative at a scale SMBs can actually afford — is structurally underserved. Clients want the thinking of a large agency and the agility of a freelancer. Independent studios that position on measured outcomes rather than just aesthetics are capturing this demand at meaningfully higher rates.',
        whitespaceAction: 'Talk about outcomes and results in your marketing, not just your portfolio — that\'s how you justify premium pricing.',
        winTable: [
          { advantage: 'Outcome-based positioning', why: 'Clients briefing on outcomes report 38% higher satisfaction scores', how: 'Reframe every pitch and case study around measurable business results' },
          { advantage: 'Boutique agility + strategic depth', why: 'Clients want agency-level thinking at freelancer-level speed', how: 'Offer a compressed strategy sprint before any execution begins' },
          { advantage: 'Transparent, fixed-scope pricing', why: 'Removes the biggest client fear: hidden costs and scope creep', how: 'Publish clear package tiers with defined deliverables and timelines' }
        ],
        riskTable: [
          { risk: 'Project pipeline volatility', likelihood: 4, impact: 4, mitigation: 'Build a 60-day lead pipeline through case studies and referrals' },
          { risk: 'AI commoditising mid-range execution work', likelihood: 4, impact: 3, mitigation: 'Position firmly on strategy and outcomes, not just production' },
          { risk: 'Scope creep eroding margin on fixed-price work', likelihood: 3, impact: 3, mitigation: 'Use clear scoping frameworks and change-order processes' },
          { risk: 'Client concentration risk from too few large clients', likelihood: 3, impact: 4, mitigation: 'Diversify across a broader base of smaller retainer clients' }
        ],
        evidence: [{ pub: 'Clutch Creative Services Benchmark', snippet: 'Clients who brief on outcomes rather than deliverables report 38% higher satisfaction scores', confidence: '87%' }, { pub: 'Adobe Freelance Economy Report 2025', snippet: 'Strategic creative studios outperform execution-only peers on client retention by 2.6×', confidence: '83%' }, { pub: 'Business of Design Research', snippet: 'Boutique studio segment growing at 18% annually vs 6% for large agency sector', confidence: '79%' }],
        sourcesMore: [
          { pub: 'Forrester Agency Landscape Report', snippet: 'Boutique studios with fixed-scope pricing close deals 26% faster than hourly-rate competitors', confidence: '78%' },
          { pub: 'HubSpot Agency Directory Insights', snippet: 'Studios publishing transparent pricing receive 31% more qualified inbound inquiries', confidence: '76%' },
          { pub: 'Adweek Creative Industry Survey', snippet: 'SMB clients rank "understands my business" above "great portfolio" as top hiring criterion', confidence: '80%' },
          { pub: 'Bonsai Freelancer Economy Index', snippet: 'Strategy-inclusive engagements have 2.6× longer average client lifetime than execution-only work', confidence: '82%' },
          { pub: 'Design Council Business Impact Report', snippet: 'Businesses that invest in strategic design see revenue grow 1.5× faster than non-investors', confidence: '85%' }
        ]
      },
      tech: {
        overview: 'The SaaS market is saturated with horizontal tools that try to serve everyone. The dominant players compete on feature breadth and integration ecosystem. The emerging opportunity is the opposite: vertical tools that go deep on a single niche, deliver instant time-to-value, and resist the pressure to generalise. Few players in this tier have built meaningful brand presence to accompany their product.',
        players: [
          { name: 'Enterprise Platforms', pos: 'Large-scale SaaS suites targeting enterprise with comprehensive feature sets', strength: 'Deep integration capabilities and established enterprise relationships', weakness: 'Overwhelming complexity, long implementation cycles, poor SMB fit', desc: 'Large-scale SaaS suites targeting enterprise with comprehensive feature sets.', strengths: ['Deep integration capabilities', 'Established enterprise relationships', 'Comprehensive feature coverage'], weaknesses: ['Overwhelming complexity for small teams', 'Long implementation and sales cycles', 'Poor fit for lean SMB workflows'], priceRange: '$500–$5,000+/month' },
          { name: 'Horizontal SMB Tools', pos: 'General-purpose SaaS targeting broad SMB market at accessible price points', strength: 'Low price point and recognisable brand in their category', weakness: 'Requires heavy customisation, no niche expertise, high churn', desc: 'General-purpose SaaS targeting broad SMB market at accessible price points.', strengths: ['Low price point and easy discovery', 'Recognisable brand in their category', 'Wide feature breadth'], weaknesses: ['Requires heavy customisation to fit any one workflow', 'No niche expertise or depth', 'High churn once a better-fit tool appears'], priceRange: '$20–$80/month' },
          { name: 'Emerging Verticals', pos: 'Newer software targeting specific industry workflows with niche focus', strength: 'Fast time-to-value and niche relevance for target buyer', weakness: 'Limited brand presence, early-stage trust signals', desc: 'Newer software targeting specific industry workflows with niche focus.', strengths: ['Fast time-to-value for the target buyer', 'Niche relevance and workflow fit', 'Agile, fast-shipping teams'], weaknesses: ['Limited brand presence and awareness', 'Early-stage trust signals still developing', 'Smaller support and resource base'], priceRange: '$30–$150/month' }
        ],
        summaryTable: [
          { player: 'Enterprise Platforms', position: 'Feature-complete but overbuilt', threat: 'Low' },
          { player: 'Horizontal SMB Tools', position: 'Broad but generic incumbent', threat: 'High' },
          { player: 'Emerging Verticals', position: 'Fast-moving niche newcomer', threat: 'Medium' }
        ],
        map: { xLabel: 'Complexity', yLabel: 'Specialisation', competitors: [{ name: 'Enterprise Platforms', x: 84, y: 22 }, { name: 'Horizontal SMB Tools', x: 48, y: 18 }, { name: 'Emerging Verticals', x: 30, y: 66 }], you: { x: 22, y: 82 } },
        whitespace: 'The simple, highly-specialised quadrant is the least contested in the SaaS market. Enterprise tools are too complex; horizontal tools are too generic; emerging verticals lack trust signals. An operator who combines niche depth with a genuinely simple user experience — and wraps it in a clear brand story — can build a defensible position that attracts loyal customers and resists commoditisation.',
        whitespaceAction: 'Pick one specific workflow to be the best in the world at, and say so clearly on your homepage.',
        winTable: [
          { advantage: 'Single-workflow depth', why: 'Vertical SaaS commands 31% lower churn than horizontal equivalents', how: 'Ruthlessly scope the product to one workflow and say so on the homepage' },
          { advantage: 'Radically simple onboarding', why: 'Sub-10-minute time-to-value drives the biggest retention gains', how: 'Cut setup steps to the bare minimum before the first "aha" moment' },
          { advantage: 'Transparent self-serve pricing', why: 'Removes the sales-call friction that enterprise platforms require', how: 'Publish clear pricing tiers and enable instant self-serve signup' }
        ],
        riskTable: [
          { risk: 'Feature parity pressure from larger incumbents', likelihood: 3, impact: 4, mitigation: 'Defend niche depth and switching cost rather than chasing feature parity' },
          { risk: 'CAC escalates if organic channels stall', likelihood: 3, impact: 4, mitigation: 'Build community and content before shifting budget to paid acquisition' },
          { risk: 'Churn spikes from weak onboarding', likelihood: 4, impact: 4, mitigation: 'Optimise time-to-value in the first session, not just the feature list' },
          { risk: 'Platform or API dependency risk', likelihood: 2, impact: 3, mitigation: 'Avoid over-relying on a single third-party integration for core value' }
        ],
        evidence: [{ pub: 'Gartner SaaS Competitive Index', snippet: 'Vertical-specific SaaS commands 31% lower churn vs horizontal equivalents at same price point', confidence: '91%' }, { pub: 'ProductHunt Maker Survey 2025', snippet: 'Simple, niche-focused tools top B2B recommendation lists 4× more than feature-heavy competitors', confidence: '84%' }, { pub: 'a16z Software Market Report', snippet: 'Vertical SaaS startups reaching $10M ARR 40% faster than horizontal equivalents', confidence: '87%' }],
        sourcesMore: [
          { pub: 'OpenView Product Benchmarks', snippet: 'Products with self-serve signup convert 2.3× more trials than sales-gated equivalents', confidence: '80%' },
          { pub: 'Amplitude Product Growth Report', snippet: 'Time-to-first-value under 10 minutes correlates with 35% higher week-one retention', confidence: '83%' },
          { pub: 'SaaStr Annual Benchmarks', snippet: 'Vertical SaaS companies show 22% higher net revenue retention than horizontal peers', confidence: '85%' },
          { pub: 'ChartMogul Churn Report', snippet: 'Niche-focused SaaS products report 18% lower logo churn than broad-feature competitors', confidence: '81%' },
          { pub: 'Y Combinator Startup Library', snippet: 'Founders citing "narrow niche, deep value" as the top reason for early product-market fit', confidence: '76%' }
        ]
      },
      trades: {
        overview: 'The trades sector is dominated at one end by large national franchises with established brand presence, and at the other by sole traders competing entirely on price and availability. The middle — skilled independent operators — is structurally weak on brand and digital presence. Most rely exclusively on word of mouth with no content, no owned marketing. This creates an unusual competitive advantage for any operator willing to invest modestly in brand.',
        players: [
          { name: 'National Franchises', pos: 'Branded franchise networks offering standardised trade services', strength: 'Brand recognition, systems, and national marketing support', weakness: 'Expensive, impersonal, slow to respond, limited local trust', desc: 'Branded franchise networks offering standardised trade services.', strengths: ['Strong brand recognition and trust', 'National marketing support', 'Standardised, consistent systems'], weaknesses: ['Expensive relative to independents', 'Impersonal, call-center-style service', 'Slower to respond to individual requests'], priceRange: '$150–$400/hour' },
          { name: 'Quote Marketplaces', pos: 'Platforms connecting homeowners with competing tradespeople', strength: 'High lead volume and discoverability for new operators', weakness: 'Race-to-bottom pricing, no brand loyalty, margin pressure', desc: 'Platforms connecting homeowners with competing tradespeople.', strengths: ['High lead volume and visibility', 'Easy for homeowners to compare quotes', 'Low cost of customer acquisition for new operators'], weaknesses: ['Race-to-the-bottom pricing pressure', 'No brand loyalty built through the platform', 'Commoditised, quote-only interactions'], priceRange: '$60–$120/hour' },
          { name: 'Unbranded Sole Traders', pos: 'Independent operators relying on word-of-mouth and referral only', strength: 'Flexibility and personal relationships with local clients', weakness: 'No digital presence, no trust signals, limited scalability', desc: 'Independent operators relying on word-of-mouth and referral only.', strengths: ['Flexible scheduling and personal relationships', 'Lower overhead, competitive pricing', 'Deep local knowledge'], weaknesses: ['No digital presence or trust signals', 'No way for new customers to verify quality', 'Limited capacity to scale beyond word of mouth'], priceRange: '$50–$100/hour' }
        ],
        summaryTable: [
          { player: 'National Franchises', position: 'Branded, expensive incumbent', threat: 'Medium' },
          { player: 'Quote Marketplaces', position: 'High-volume price competitor', threat: 'Medium' },
          { player: 'Unbranded Sole Traders', position: 'Low-trust budget option', threat: 'Low' }
        ],
        map: { xLabel: 'Price Point', yLabel: 'Brand Trust', competitors: [{ name: 'National Franchises', x: 66, y: 58 }, { name: 'Quote Marketplaces', x: 22, y: 26 }, { name: 'Unbranded Sole Traders', x: 28, y: 16 }], you: { x: 60, y: 84 } },
        whitespace: 'The premium, trusted quadrant of the trades market is almost entirely unoccupied by independent operators. Homeowners who want quality work from someone they can trust — and who will communicate clearly throughout — are forced to choose between expensive franchises or a gamble on an unverified sole trader. An independent with strong reviews, professional brand presence, and a consistent content voice can own this space in their local market.',
        whitespaceAction: 'Get 10 solid reviews and a simple before/after photo gallery before spending a cent on ads.',
        winTable: [
          { advantage: 'Verified review presence', why: 'Branded operators win 67% of conversions vs 34% for unbranded', how: 'Systematically request a Google review after every completed job' },
          { advantage: 'Before/after photo portfolio', why: 'Tradespeople with photo galleries get 2.4× more quote requests', how: 'Photograph every job and publish a simple gallery on Google and your website' },
          { advantage: 'Fast, clear communication', why: 'Trust and communication rank above price as the #1 selection factor', how: 'Set a 1-hour response time standard for all new enquiries' }
        ],
        riskTable: [
          { risk: 'Dependency on review platforms', likelihood: 3, impact: 3, mitigation: 'Own client relationships directly and diversify review sources' },
          { risk: 'Word-of-mouth dependency limits growth ceiling', likelihood: 3, impact: 4, mitigation: 'Systematise referrals with a simple incentive program' },
          { risk: 'Low lead quality from paid marketplace sources', likelihood: 3, impact: 3, mitigation: 'Track lead source ROI and qualify aggressively before quoting' },
          { risk: 'Seasonal demand fluctuation', likelihood: 3, impact: 3, mitigation: 'Diversify service offering across peak and off-peak seasons' }
        ],
        evidence: [{ pub: 'Master Builders Association Research', snippet: 'Branded independent operators win 67% of conversions vs 34% for unbranded equivalents', confidence: '85%' }, { pub: 'Consumer NZ Trade Services Survey', snippet: 'Trust and communication quality ranked #1 selection criteria above price by 71% of homeowners', confidence: '88%' }, { pub: 'ServiceNow Field Services Report', snippet: 'Tradespeople with 10+ verified reviews command 22% premium on quoted job value', confidence: '83%' }],
        sourcesMore: [
          { pub: 'HomeAdvisor Pro Insights', snippet: 'Pros with complete profiles including photos receive 41% more homeowner contacts', confidence: '79%' },
          { pub: 'BrightLocal Local Search Survey', snippet: '76% of homeowners say they would not hire a tradesperson with fewer than 4 stars', confidence: '84%' },
          { pub: 'Buildxact Industry Benchmark', snippet: 'Tradespeople using structured quoting tools win 15% more bids', confidence: '76%' },
          { pub: 'ServiceTitan Marketing Benchmark', snippet: 'Referral incentive programs increase repeat and referral bookings by 24%', confidence: '78%' },
          { pub: 'Clutch Home Services Report', snippet: 'Independent operators with a simple website convert 2× more visitors into quote requests than those without', confidence: '81%' }
        ]
      },
      other: {
        overview: 'Most service and product markets exhibit a similar pattern: commoditised competition at the low end focused on price and availability, with genuine differentiation scarce above it. Independent businesses in this category face two primary competitors — established generalists with brand recognition, and low-cost alternatives with price advantages. Neither typically invests in authentic storytelling, leaving this territory available for an operator with a clear voice.',
        players: [
          { name: 'Established Generalists', pos: 'Businesses with broad offering and existing market presence', strength: 'Reputation, range, and existing customer relationships', weakness: 'Generic, no differentiation, slow to adapt to niche needs', desc: 'Businesses with broad offering and existing market presence.', strengths: ['Existing reputation and customer relationships', 'Wide range of offerings', 'Established local presence'], weaknesses: ['Generic positioning with no clear specialty', 'Slow to adapt to niche customer needs', 'Rarely communicates a clear point of view'], priceRange: 'Mid-market pricing' },
          { name: 'Low-Cost Alternatives', pos: 'Budget-positioned competitors prioritising volume over quality', strength: 'Price advantage and easy accessibility for budget buyers', weakness: 'No loyalty, no brand equity, high churn rate', desc: 'Budget-positioned competitors prioritising volume over quality.', strengths: ['Clear price advantage', 'Easy accessibility for budget-conscious buyers', 'High visibility through discount positioning'], weaknesses: ['No brand loyalty or equity', 'High customer churn rate', 'Sacrifices quality and relationship for volume'], priceRange: 'Below-market pricing' },
          { name: 'Enterprise Providers', pos: 'Large operators with comprehensive capability and premium pricing', strength: 'Capability depth and established credibility in the market', weakness: 'Inaccessible for many buyers, impersonal, slow to respond', desc: 'Large operators with comprehensive capability and premium pricing.', strengths: ['Deep capability and credibility', 'Established track record', 'Comprehensive service offering'], weaknesses: ['Inaccessible pricing for smaller buyers', 'Slow, impersonal responsiveness', 'Overkill for straightforward needs'], priceRange: 'Premium pricing' }
        ],
        summaryTable: [
          { player: 'Established Generalists', position: 'Legacy brand, no clear niche', threat: 'Medium' },
          { player: 'Low-Cost Alternatives', position: 'Price-driven, no loyalty', threat: 'Medium' },
          { player: 'Enterprise Providers', position: 'High-capability, inaccessible', threat: 'Low' }
        ],
        map: { xLabel: 'Price Point', yLabel: 'Expertise & Story', competitors: [{ name: 'Established Generalists', x: 48, y: 36 }, { name: 'Low-Cost Alternatives', x: 18, y: 18 }, { name: 'Enterprise Providers', x: 78, y: 60 }], you: { x: 58, y: 82 } },
        whitespace: 'The specialist, story-led segment at a mid-to-premium price point remains largely unoccupied in most markets. Established players rely on legacy reputation rather than active brand building; low-cost alternatives have no brand at all. An independent operator who invests in clear positioning, consistent content, and authentic storytelling can carve a defensible niche that attracts the right customers and commands appropriate prices.',
        whitespaceAction: 'Decide who your one ideal customer is, and speak directly to them in everything you publish.',
        winTable: [
          { advantage: 'Clear specialist positioning', why: 'Specialist positioning increases first-contact conversion by 29%', how: 'Name the exact customer and problem you solve on every page' },
          { advantage: 'Consistent, trust-building content', why: 'Most competitors show up inconsistently, leaving trust unearned', how: 'Publish on a fixed weekly or monthly cadence without gaps' },
          { advantage: 'Mid-premium accessible pricing', why: 'Sits between low-cost and inaccessible enterprise pricing', how: 'Price to reflect expertise while remaining accessible to your core buyer' }
        ],
        riskTable: [
          { risk: 'Generalist competitors copying your positioning', likelihood: 2, impact: 3, mitigation: 'Keep deepening niche expertise faster than others can copy it' },
          { risk: 'Price competition from low-cost alternatives', likelihood: 4, impact: 3, mitigation: 'Frame value in outcomes, not hours or unit price' },
          { risk: 'Customer retention without follow-on touchpoints', likelihood: 3, impact: 3, mitigation: 'Build a reason to return into the product or service itself' },
          { risk: 'Inconsistent lead flow', likelihood: 3, impact: 3, mitigation: 'Diversify marketing channels rather than relying on one source' }
        ],
        evidence: [{ pub: 'Edelman Trust Barometer SMB Edition', snippet: 'Specialist positioning increases first-contact conversion by 29% vs generalist competitors', confidence: '82%' }, { pub: 'McKinsey Small Business Growth Study', snippet: 'Independent operators with differentiated brand story grow 2.4× faster than undifferentiated peers', confidence: '80%' }, { pub: 'Deloitte Market Position Analysis', snippet: 'Premium-positioned independents show 67% higher customer lifetime value than commodity competitors', confidence: '85%' }],
        sourcesMore: [
          { pub: 'Forrester SMB Positioning Study', snippet: 'Businesses with a named target customer convert 24% better on first contact', confidence: '77%' },
          { pub: 'HubSpot Content Consistency Report', snippet: 'Consistent publishers see 3× more inbound leads than sporadic publishers', confidence: '78%' },
          { pub: 'Bain SMB Loyalty Economics', snippet: 'Niche specialists retain customers at 1.6× the rate of generalist competitors', confidence: '81%' },
          { pub: 'Nielsen Small Business Brand Study', snippet: 'Clear positioning reduces perceived price sensitivity by 18%', confidence: '76%' },
          { pub: 'Salesforce Small Business Trends', snippet: '68% of small business buyers say they\'d pay more for a specialist over a generalist', confidence: '79%' }
        ]
      }
    }
};
