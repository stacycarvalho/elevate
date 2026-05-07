export const P = {
  aarav: {
    name: 'Aarav Sharma', first: 'Aarav', initial: 'A', color: '#0B8A68', score: 41, tier: 1,
    greeting: 'Good evening, Aarav 👋',
    welcomeSub: "Here's what I've been watching for you today.",
    tierLabel: 'Tier 1 — The Survivor',
    encouragement: "You've checked in 4 days in a row — that's how habits start. 💪",
    kpis: [
      { label: 'Net worth', value: '₹12,400', delta: '↑ ₹800', dir: 'up', tip: 'Everything you own minus everything you owe. Think of it as your financial score card.' },
      { label: "This month's spend", value: '₹28,100', delta: '↑ ₹3,200', dir: 'down', tip: 'Total money that went out this month across all categories.' },
      { label: 'Savings rate', value: '4.2%', delta: '↓ from 6%', dir: 'down', tip: "What percentage of your income you're actually keeping. Aim for 20%+ over time." },
      { label: 'Health score', value: '41/100', delta: '↑ +3 pts', dir: 'up', tip: 'Your overall financial health across 6 dimensions. Calculated weekly.' },
    ],
    needed: [
      { title: 'Your credit card is costing you money', body: "You're carrying ₹15,000 on your Axis card. At 36% annual interest, that's ₹450 every month just in fees — money that goes nowhere. Let's make a plan to clear this.", actions: ['See payoff plan', 'Remind me later'] },
      { title: 'No safety net yet', body: "You don't have an emergency fund. If your phone breaks or you need a doctor, you'd have to borrow. 3 months of expenses = ₹96,000. I can start building this automatically with ₹500 every Friday.", actions: ['Start ₹500/week', 'Tell me more'] },
    ],
    taken: [
      { title: 'Auto-saved ₹340 in round-ups', body: 'Over the last 7 days, I rounded up 14 transactions and moved the spare change to your savings account. Small amounts, real progress.', time: 'This week', tag: { text: 'Completed', bg: 'var(--ok-dim)', color: 'var(--ok)' } },
    ],
    growth: [
      { title: "Did you know? Credit cards aren't free money", body: 'Your card charges 3% per month on unpaid balance. That means ₹10,000 unpaid for a year costs you ₹3,600 extra. Paying even ₹2,000 extra each month cuts that in half.', actions: ["See how much I'd save"] },
    ],
    insights: [
      { label: "This week's insight", title: 'Swiggy is your biggest leak', body: "You've spent ₹4,200 on food delivery this month — 13% of your take-home. That's more than you saved. Even cutting back by half adds ₹2,100 to your savings every month." },
      { label: 'Anomaly spotted', title: 'Your electricity bill jumped', body: "This month's electricity charge (₹2,400) is ₹800 higher than your 3-month average. Worth checking if something was left on." },
    ],
    dims: [
      { label: 'Cash flow', score: 28, color: '#C42B2B' }, { label: 'Debt', score: 18, color: '#C42B2B' },
      { label: 'Protection', score: 5, color: '#C42B2B' }, { label: 'Savings', score: 12, color: '#C47A0C' },
      { label: 'Investing', score: 0, color: '#E0E3F5' }, { label: 'Planning', score: 10, color: '#C47A0C' },
    ],
    hasCf: false, hasPlan: 'goals',
    goals: [
      { name: 'Emergency fund', target: 96000, current: 8000, monthly: 500, color: '#3A5AF9', insight: "At ₹500/week, you'll hit 1 month's expenses in 14 weeks. Increasing to ₹1,000/week cuts that in half." },
      { name: 'New phone', target: 80000, current: 12000, monthly: 2000, color: '#0B8A68', insight: 'Based on your current surplus, you could increase this by ₹500/month and get there 3 months earlier.' },
    ],
    spending: [
      { cat: 'Food & delivery', ico: '🍜', bg: '#FDF3E3', amount: 7800, pct: 78, color: '#C47A0C' },
      { cat: 'Rent & utilities', ico: '🏠', bg: '#EEF1FE', amount: 12000, pct: 100, color: '#3A5AF9' },
      { cat: 'Transport', ico: '🚗', bg: '#E3F5EF', amount: 3200, pct: 42, color: '#0B8A68' },
      { cat: 'Shopping', ico: '🛍️', bg: '#FDEAEA', amount: 4100, pct: 55, color: '#C42B2B' },
      { cat: 'Entertainment', ico: '🎬', bg: '#F4F5FD', amount: 1000, pct: 20, color: '#9197B8' },
    ],
    cfData: { income: 32000, spend: 28100, surplus: 3900, months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], spendData: [24000, 27000, 25000, 29000, 26000, 28100], incomeData: [32000, 32000, 32000, 32000, 32000, 32000], catInsight: 'Food delivery is 28% of your total spend — nearly double what most people your income level spend on food. Your rent is fixed, but this category has room to move.' },
  },
  priya: {
    name: 'Priya Nair', first: 'Priya', initial: 'P', color: '#C47A0C', score: 56, tier: 2,
    greeting: 'Good evening, Priya 🌙',
    welcomeSub: '3 things need your attention today.',
    tierLabel: 'Tier 2 — The Builder',
    encouragement: 'Your savings rate improved 3 months in a row. That\'s real momentum. 🌱',
    kpis: [
      { label: 'Household net worth', value: '₹42.8L', delta: '↑ ₹1.2L', dir: 'up', tip: 'Your household\'s total assets (home equity, savings, investments) minus all liabilities (loans, credit cards).' },
      { label: 'Monthly surplus', value: '₹18,400', delta: '↑ ₹2,100', dir: 'up', tip: "What's left after all your expenses and EMIs are paid. This is what you can put to work." },
      { label: 'EMI burden', value: '23%', delta: 'Healthy', dir: 'neutral', tip: 'The percentage of your household income going to loan repayments. Under 30% is considered healthy.' },
      { label: 'Health score', value: '56/100', delta: '↑ +6 pts', dir: 'up', tip: 'Your financial health across 6 dimensions. 56 means you\'re stable but have clear gaps to close.' },
    ],
    needed: [
      { title: 'No term insurance — your family is exposed', body: 'Your household earns ₹1.8L/month with Aryan depending on you. If either income stopped, your EMI alone (₹42,000) would drain your savings in 14 months. A ₹1Cr term cover for both of you costs roughly ₹1,600/month combined.', actions: ['Get a quote', 'How does term insurance work?'] },
      { title: "Aryan's education fund — clock is ticking", body: 'Aryan turns 3 next month. College costs are rising at 10% per year. Starting a ₹5,000/month SIP in equity today gives you ₹32L in 15 years — exactly what you\'d need.', actions: ['Start SIP', 'Show me the projection'] },
    ],
    taken: [
      { title: 'Irregular expense buffer created', body: "I spotted ₹48,000 in annual irregular costs — school fees, car servicing, insurance renewals. Divided by 12, that's ₹4,000/month. I've set up an auto-save so these never surprise you.", time: 'Yesterday', tag: { text: 'Completed', bg: 'var(--ok-dim)', color: 'var(--ok)' } },
      { title: 'Subscriptions audited', body: "Found 5 active subscriptions between you and Kiran. Flagged one unused (Kiran's Audible — no activity in 4 months). Total potential saving: ₹199/month.", time: '2 days ago', tag: { text: 'Flagged', bg: 'var(--warn-dim)', color: 'var(--warn)' } },
    ],
    growth: [
      { title: 'The 50/30/20 rule — and where you stand', body: "A popular budgeting framework: 50% on needs, 30% on wants, 20% on savings. Right now you're at 64% needs, 20% wants, 16% savings. Nudging savings to 20% means ₹3,600 more working for you every month.", actions: ['Help me adjust my budget'] },
    ],
    insights: [
      { label: 'Household insight', title: 'Your combined surplus is underused', body: "You have ₹18,400/month surplus but only ₹9,000 is going into goals. The remaining ₹9,400 is sitting idle in your salary account. I can put this to work for you." },
      { label: 'Trend spotted', title: 'Grocery spend has risen 18% in 3 months', body: 'Your household grocery bill was ₹15,200 in February and ₹18,000 this month. Likely inflation — but worth being aware of as you plan next quarter\'s budget.' },
    ],
    dims: [
      { label: 'Cash flow', score: 68, color: '#0B8A68' }, { label: 'Debt', score: 55, color: '#C47A0C' },
      { label: 'Protection', score: 12, color: '#C42B2B' }, { label: 'Savings', score: 58, color: '#C47A0C' },
      { label: 'Investing', score: 62, color: '#0B8A68' }, { label: 'Planning', score: 44, color: '#C47A0C' },
    ],
    hasCf: true, hasPlan: 'goals+nw',
    goals: [
      { name: "Aryan's education", target: 3200000, current: 120000, monthly: 5000, color: '#3A5AF9', insight: "At current pace you'll reach ₹16.4L by the time Aryan is 18 — half of what's needed. Increasing to ₹8,000/month closes the gap." },
      { name: 'Family holiday', target: 200000, current: 68000, monthly: 8000, color: '#0B8A68', insight: "On track. You'll hit this goal in 16 months at the current rate. Nothing to change here." },
      { name: 'Emergency fund (6mo)', target: 540000, current: 310000, monthly: 4000, color: '#C47A0C', insight: '57% there. At ₹4,000/month you\'ll complete this in 57 months. Adding ₹2,000 extra cuts it to 38 months.' },
    ],
    spending: [
      { cat: 'Home loan EMI', ico: '🏠', bg: '#EEF1FE', amount: 42000, pct: 100, color: '#3A5AF9' },
      { cat: 'Groceries & food', ico: '🛒', bg: '#FDF3E3', amount: 18000, pct: 62, color: '#C47A0C' },
      { cat: 'Child expenses', ico: '👶', bg: '#E3F5EF', amount: 12000, pct: 45, color: '#0B8A68' },
      { cat: 'Transport', ico: '🚗', bg: '#F4F5FD', amount: 8000, pct: 28, color: '#9197B8' },
      { cat: 'Subscriptions', ico: '📱', bg: '#FDEAEA', amount: 4200, pct: 22, color: '#C42B2B' },
    ],
    cfData: { income: 180000, spend: 160000, surplus: 18400, months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], spendData: [142000, 155000, 148000, 162000, 158000, 160000], incomeData: [180000, 180000, 180000, 180000, 180000, 180000], catInsight: 'Your EMI is fixed at 23% of income — that\'s healthy. The area to watch is groceries, which has risen 18% over 3 months and is now your second-largest category.' },
  },
  sunita: {
    name: 'Sunita Rao', first: 'Sunita', initial: 'S', color: '#9197B8', score: 62, tier: 2,
    greeting: 'Good afternoon, Sunita 🙏',
    welcomeSub: 'Everything looks stable today. One thing to review.',
    tierLabel: 'Tier 2 — The Builder',
    encouragement: 'Your savings have lasted 23 years at current pace. You\'ve planned well. 🌸',
    kpis: [
      { label: 'Monthly pension', value: '₹55,000', delta: 'Fixed income', dir: 'neutral', tip: 'Your fixed monthly income from pension. Stable and predictable — a strong foundation.' },
      { label: 'Corpus runway', value: '23 years', delta: 'Good standing', dir: 'up', tip: 'How long your current savings will last at your current spending rate. Accounts for pension income continuing.' },
      { label: 'Monthly surplus', value: '₹12,400', delta: '↑ ₹800', dir: 'up', tip: "What's left each month after all your expenses. This is quietly building your cushion." },
      { label: 'Health score', value: '62/100', delta: 'Stable', dir: 'neutral', tip: 'Your overall financial health score. 62 is solid — especially on debt and cash flow.' },
    ],
    needed: [
      { title: 'SBI FD matures in 18 days', body: 'Your ₹8,00,000 Fixed Deposit at 7.1% p.a. matures on June 2. HDFC Bank is currently offering 7.25% for 2 years — that\'s ₹1,200 extra per year on the same amount. Worth comparing before you auto-renew.', actions: ['Compare rates', 'Renew at SBI'] },
    ],
    taken: [
      { title: "Vivek's family view is active", body: "Your son Vivek can now see your corpus runway, FD maturity calendar and health score from the US. He cannot see individual transactions and cannot take any financial action.", time: '3 days ago', tag: { text: 'Active', bg: 'var(--ok-dim)', color: 'var(--ok)' } },
      { title: 'Inflation check run on your FDs', body: 'Your FDs are averaging 6.9% annual return. Current inflation is approximately 5.8%. Your real return (what you\'re actually gaining in purchasing power) is +1.1%. Safe and steady.', time: 'Last week', tag: { text: 'Routine', bg: 'var(--surface2)', color: 'var(--t3)' } },
    ],
    growth: [
      { title: "What is a Senior Citizens' Savings Scheme?", body: 'SCSS is a government-backed savings scheme for people 60+ offering 8.2% p.a. — higher than most FDs. It has a 5-year tenure with quarterly interest payouts. Worth considering for a portion of your corpus.', actions: ['Learn more about SCSS'] },
    ],
    insights: [
      { label: 'Corpus insight', title: 'Your savings will outlast you comfortably', body: "At your current spending of ₹42,600/month and with your pension covering ₹55,000, you're actually adding to your corpus, not drawing from it. You're in a better position than most." },
      { label: 'Inflation note', title: 'FD returns are staying ahead of inflation', body: 'With 6.9% average FD return and inflation at 5.8%, your real return is positive. This is good. If inflation rises above 7%, it may be worth diversifying into SCSS or RBI Bonds.' },
    ],
    dims: [
      { label: 'Cash flow', score: 74, color: '#0B8A68' }, { label: 'Debt', score: 92, color: '#0B8A68' },
      { label: 'Protection', score: 58, color: '#C47A0C' }, { label: 'Savings', score: 65, color: '#0B8A68' },
      { label: 'Investing', score: 38, color: '#C42B2B' }, { label: 'Planning', score: 44, color: '#C47A0C' },
    ],
    hasCf: true, hasPlan: 'corpus',
    goals: [
      { name: 'Medical emergency fund', target: 500000, current: 280000, monthly: 5000, color: '#3A5AF9', insight: "56% funded. At ₹5,000/month you'll complete this in 44 months. You might consider a top-up health insurance plan as an alternative for medical expenses." },
      { name: "Vivek's wedding gift", target: 300000, current: 180000, monthly: 3000, color: '#0B8A68', insight: "60% done. On track to complete in 40 months. If the wedding is sooner, I can help you adjust the monthly contribution." },
    ],
    spending: [
      { cat: 'Groceries & home', ico: '🛒', bg: '#E3F5EF', amount: 18000, pct: 82, color: '#0B8A68' },
      { cat: 'Medical & pharma', ico: '💊', bg: '#FDF3E3', amount: 8000, pct: 45, color: '#C47A0C' },
      { cat: 'Utilities', ico: '⚡', bg: '#EEF1FE', amount: 4200, pct: 28, color: '#3A5AF9' },
      { cat: 'Temple & charity', ico: '🙏', bg: '#FDEAEA', amount: 3000, pct: 18, color: '#C42B2B' },
      { cat: 'Entertainment', ico: '📺', bg: '#F4F5FD', amount: 1800, pct: 12, color: '#9197B8' },
    ],
    cfData: { income: 55000, spend: 42600, surplus: 12400, months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], spendData: [41000, 44000, 42000, 43500, 42000, 42600], incomeData: [55000, 55000, 55000, 55000, 55000, 55000], catInsight: 'Your spending is remarkably consistent month to month — a sign of good habits. Medical expenses are your most variable category and worth having a dedicated buffer for.' },
  },
  mehul: {
    name: 'Mehul Patel', first: 'Mehul', initial: 'M', color: '#3A5AF9', score: 74, tier: 3,
    greeting: 'Good morning, Mehul ☀️',
    welcomeSub: '2 opportunities and 1 action waiting for you.',
    tierLabel: 'Tier 3 — The Optimiser',
    encouragement: 'Your net worth grew ₹3.2L this month. 14 years to FIRE — and you\'re ahead of pace. 🚀',
    kpis: [
      { label: 'Net worth', value: '₹1.24Cr', delta: '↑ ₹3.2L', dir: 'up', tip: 'Total value of all assets (mutual funds, equity, PPF, property equity) minus all liabilities (home loan).' },
      { label: 'FIRE progress', value: '31%', delta: 'On track', dir: 'up', tip: "FIRE stands for Financial Independence, Retire Early. 31% means you've built ₹1.24Cr of your ₹4Cr target." },
      { label: 'Savings rate', value: '34%', delta: '↑ +2%', dir: 'up', tip: '34% of your income is being saved or invested. The global benchmark for FIRE is 25-50%.' },
      { label: 'Health score', value: '74/100', delta: '↑ +8 pts', dir: 'up', tip: 'Your overall financial health. 74 is strong — your main gap is planning maturity (tax and estate planning).' },
    ],
    needed: [
      { title: 'Portfolio rebalancing — approve to execute', body: "Your equity allocation has drifted to 78% (target: 70%) as markets ran up 12% this quarter. I'll move ₹1.8L from HDFC Flexi Cap to ICICI Pru Short Duration. No LTCG triggered — tax efficient.", actions: ['Approve ✓', 'Modify', 'Why now?'] },
    ],
    taken: [
      { title: 'Auto-save executed — ₹8,000 to FIRE fund', body: 'Salary surplus of ₹22,400 detected after all fixed obligations. Per your standing rule (save 35% of surplus), I transferred ₹8,000 to your FIRE savings account.', time: 'May 1, 10:32 AM', tag: { text: 'Completed', bg: 'var(--ok-dim)', color: 'var(--ok)' } },
      { title: 'Bill negotiation email drafted — Airtel', body: "You've been on ₹999/month for 26 months. Market equivalent is ₹749. Draft email is ready citing loyalty and competitor pricing.", time: 'May 3, 2:15 PM', tag: { text: 'Awaiting review', bg: 'var(--brand-dim)', color: 'var(--brand)' } },
    ],
    growth: [
      { title: 'Tax-loss harvesting — ₹4,200 in tax savings available', body: '3 equity positions in your Zerodha portfolio are at unrealised losses totalling ₹42,000. Selling these before March 31 offsets LTCG gains — saving approximately ₹4,200 in tax this financial year.', actions: ['See positions', 'How does this work?'] },
    ],
    insights: [
      { label: 'FIRE insight', title: "You're 3 years ahead of a standard schedule", body: "At your current savings rate, you'll hit ₹4Cr at 54. Most people on the same income hit it at 57. Increasing your SIP by ₹10,000/month moves this to 51." },
      { label: 'Portfolio insight', title: 'Your HDFC Flexi Cap has drifted from benchmark', body: 'Over the last 3 years, HDFC Flexi Cap has underperformed Nifty 500 by 1.8% annually. This is a 3-year trend worth reviewing — I can show you alternatives.' },
    ],
    dims: [
      { label: 'Cash flow', score: 82, color: '#0B8A68' }, { label: 'Debt', score: 71, color: '#0B8A68' },
      { label: 'Protection', score: 68, color: '#0B8A68' }, { label: 'Savings', score: 88, color: '#0B8A68' },
      { label: 'Investing', score: 76, color: '#0B8A68' }, { label: 'Planning', score: 64, color: '#C47A0C' },
    ],
    hasCf: true, hasPlan: 'full',
    goals: [
      { name: 'FIRE corpus', target: 40000000, current: 12400000, monthly: 55000, color: '#3A5AF9', insight: '31% funded. At current pace, reach target at 54. Boosting SIP by ₹10K/month moves FIRE date to 51.' },
      { name: 'Home loan payoff', target: 4200000, current: 2800000, monthly: 35000, color: '#0B8A68', insight: '67% paid off. Ahead of schedule by 8 months. Making one extra EMI per year saves ₹3.2L in interest.' },
      { name: "Kids' education", target: 8000000, current: 1200000, monthly: 20000, color: '#C47A0C', insight: '15% funded with 12 years to target. On track if markets average 12% CAGR. Consider increasing by ₹3,000/month as a buffer.' },
    ],
    spending: [
      { cat: 'Home loan EMI', ico: '🏠', bg: '#EEF1FE', amount: 85000, pct: 100, color: '#3A5AF9' },
      { cat: 'SIPs & investments', ico: '📈', bg: '#E3F5EF', amount: 55000, pct: 65, color: '#0B8A68' },
      { cat: 'Living expenses', ico: '🏙️', bg: '#FDF3E3', amount: 45000, pct: 53, color: '#C47A0C' },
      { cat: 'Kids & education', ico: '📚', bg: '#F4F5FD', amount: 28000, pct: 33, color: '#9197B8' },
      { cat: 'Dining & leisure', ico: '🍽️', bg: '#FDEAEA', amount: 22000, pct: 26, color: '#C42B2B' },
    ],
    cfData: { income: 320000, spend: 235800, surplus: 84200, months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], spendData: [218000, 245000, 228000, 251000, 238000, 235800], incomeData: [320000, 320000, 320000, 320000, 320000, 320000], catInsight: 'Your SIPs and EMI together account for 59% of income — intentionally high as part of your FIRE strategy. Living expenses at ₹45K have been stable. Dining and leisure is your most discretionary category and well within healthy limits.' },
  },
}
