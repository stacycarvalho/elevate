export const allTxns = [
  { merchant: 'Swiggy', cat: 'Food', ico: '🍜', bg: '#FDF3E3', amt: -840, date: 'Today, 1:22 PM', type: 'debit' },
  { merchant: 'HDFC FD Interest', cat: 'Income', ico: '🏦', bg: '#E3F5EF', amt: 4200, date: 'Today, 10:00 AM', type: 'credit' },
  { merchant: 'Zerodha SIP', cat: 'Investment', ico: '📈', bg: '#EEF1FE', amt: -15000, date: 'Yesterday', type: 'debit' },
  { merchant: 'Airtel broadband', cat: 'Bills', ico: '📡', bg: '#F4F5FD', amt: -999, date: 'May 5', type: 'debit' },
  { merchant: 'Amazon', cat: 'Shopping', ico: '📦', bg: '#FDF3E3', amt: -3499, date: 'May 4', type: 'debit' },
  { merchant: 'Salary', cat: 'Income', ico: '💼', bg: '#E3F5EF', amt: 320000, date: 'May 1', type: 'credit' },
  { merchant: 'Uber', cat: 'Transport', ico: '🚗', bg: '#F4F5FD', amt: -340, date: 'Apr 30', type: 'debit' },
  { merchant: 'Netflix', cat: 'Subscriptions', ico: '🎬', bg: '#FDEAEA', amt: -649, date: 'Apr 29', type: 'debit' },
  { merchant: 'Home Loan EMI', cat: 'EMI', ico: '🏠', bg: '#EEF1FE', amt: -85000, date: 'Apr 28', type: 'debit' },
  { merchant: 'Namma Yatri', cat: 'Transport', ico: '🛺', bg: '#FDF3E3', amt: -180, date: 'Apr 27', type: 'debit' },
]

export const subs = [
  { name: 'Netflix', amt: '₹649/month', plan: 'Premium — inferred from charge amount', months: 8, prompt: "You're on the most expensive plan. Still using multiple screens regularly?" },
  { name: 'Swiggy One', amt: '₹1,299/year', plan: 'Annual membership', months: 3, prompt: 'Your last 3 orders were under ₹200 each. The membership pays off only above ₹300/order.' },
  { name: 'Airtel', amt: '₹999/month', plan: 'Postpaid — 26 months active', months: 26, prompt: "Market equivalent plan is ₹749/month. I've drafted a negotiation email ready to send." },
  { name: 'Spotify', amt: '₹119/month', plan: 'Individual plan — 14 months active', months: 14, prompt: 'Actively used. No action needed.' },
]

export const agentLogData = [
  { ico: '✓', bg: 'var(--ok-dim)', color: 'var(--ok)', title: 'Auto-save executed — ₹8,000 to FIRE fund', body: 'Salary surplus of ₹22,400 detected. Per standing rule (save 35% of surplus), transferred ₹8,000 to FIRE savings account. Remaining ₹14,400 left in salary account as buffer.', time: 'May 1, 10:32 AM', tags: [{ text: 'Completed', bg: 'var(--ok-dim)', color: 'var(--ok)' }] },
  { ico: '📧', bg: 'var(--brand-dim)', color: 'var(--brand)', title: 'Negotiation email drafted — Airtel', body: 'Airtel plan (₹999/month, 26 months) identified as overpriced vs market rate of ₹749. Drafted email citing loyalty tenure and competitor pricing. Awaiting your review before sending.', time: 'May 3, 2:15 PM', tags: [{ text: 'Awaiting your review', bg: 'var(--brand-dim)', color: 'var(--brand)' }] },
  { ico: '🔍', bg: 'var(--surface2)', color: 'var(--t3)', title: 'Monthly health scan completed', body: 'Full 6-dimension scan run. Net worth increased ₹3.2L this month. Health score improved 71 → 74. Main driver: portfolio returns (+8.2%).', time: 'May 1, 6:00 AM', tags: [{ text: 'Routine', bg: 'var(--surface2)', color: 'var(--t3)' }] },
  { ico: '⚡', bg: 'var(--warn-dim)', color: 'var(--warn)', title: 'Portfolio rebalancing flagged', body: 'Equity allocation drifted to 78% from 70% target. Rebalancing recommendation drafted — move ₹1.8L to short-duration debt. Awaiting your approval before any action is taken.', time: 'Apr 28, 9:14 AM', tags: [{ text: 'Pending your approval', bg: 'var(--warn-dim)', color: 'var(--warn)' }] },
]

export const perms = [
  { tier: 1, name: 'Read and analyse', desc: 'Categorise your transactions, detect unusual spending, track subscriptions. Always running quietly in the background.', fixed: 'Always on' },
  { tier: 2, name: 'Alert and notify', desc: 'Bill reminders, overspending warnings, FD maturity alerts. Notifies you — takes no action.', fixed: null },
  { tier: 3, name: 'Suggest — quick confirm', desc: 'Round-up savings, budget rules, subscription flags. One tap to approve or skip.', fixed: null },
  { tier: 4, name: 'Execute with your approval', desc: 'Fund transfers, negotiation emails, subscription cancellation. Always shows you what it\'s about to do first.', fixed: null },
  { tier: 5, name: 'High-stakes actions', desc: 'Investments, large transfers, loan applications, account changes. Always asks. Cannot be changed to automatic.', fixed: 'Always ask' },
]

export const goalFlow = [
  'What are you saving for? A car, a house, a holiday, retirement — anything.',
  'Good to know. What\'s the rough amount you\'re aiming for? A ballpark is fine.',
  'And when do you want to reach this by? Give me a rough timeline — 1 year, 3 years, whenever.',
  "Perfect. Based on your current surplus of ₹84,200/month, I'd recommend saving ₹8,200/month toward this. That gets you there in about 24 months. Want me to set up an auto-save rule?",
]

export const aiResponses = {
  swiggy: "You've spent ₹4,200 on Swiggy this month — 13% of your take-home. Your 3-month average is ₹2,900.",
  fire: 'At current savings and portfolio, you reach FIRE at 54. Increasing SIP by ₹10K/month moves this to 51.',
  save: 'Your savings rate is 34% this month. Strong. Emergency fund covers 16 months of expenses.',
  invest: 'Portfolio is 78% equity vs 70% target. Rebalancing card is waiting on Home for your approval.',
  goal: 'You have 3 active goals. FIRE corpus is 31% funded. Home loan is 67% repaid.',
  score: 'Health score is 74. Strongest: savings (88). Biggest gap: planning maturity (64) — tax and estate planning.',
  health: 'Your health score is made up of 6 dimensions: cash flow, debt, protection, savings, investing, and planning. Each is scored 0–100.',
  interest: 'Interest is what you pay to borrow money or earn when you save. Credit card interest in India is typically 36–42% per year — among the highest legal rates.',
  sip: 'A SIP (Systematic Investment Plan) means investing a fixed amount every month in a mutual fund, regardless of market conditions. It builds discipline and benefits from market averaging.',
  default: "I'm watching your finances in real-time. What would you like to understand or do?",
}
