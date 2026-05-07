import { useState } from 'react'

const STEPS = [
  {
    title: 'Welcome to Elevate',
    sub: 'Three quick questions to personalise your experience. Fact-based — no self-assessment.',
    type: 'single',
    key: 'q1',
    opts: [
      { value: 'student', ico: '🎓', label: 'Student' },
      { value: 'firstjob', ico: '💼', label: 'First job', sub: 'Under 2 years' },
      { value: 'working', ico: '🏙️', label: 'Working, no major commitments' },
      { value: 'family', ico: '👨‍👩‍👧', label: 'Working, with family or EMIs' },
      { value: 'retired', ico: '🌅', label: 'Retired or near retirement' },
    ],
  },
  {
    title: 'What do you have today?',
    sub: 'Select all that apply.',
    type: 'multi',
    key: 'q2',
    opts: [
      { value: 'savings', ico: '🏦', label: 'Savings account only' },
      { value: 'cc', ico: '💳', label: 'Credit card' },
      { value: 'loan', ico: '🏠', label: 'Home or vehicle loan' },
      { value: 'mf', ico: '📈', label: 'Mutual funds or SIPs' },
      { value: 'stocks', ico: '📊', label: 'Direct stocks' },
      { value: 'fd', ico: '🔒', label: 'Fixed deposits' },
    ],
  },
  {
    title: 'What matters most?',
    sub: 'This sets your home screen focus.',
    type: 'single',
    key: 'q3',
    opts: [
      { value: 'vis', ico: '👁️', label: 'Understand where my money goes' },
      { value: 'spend', ico: '✂️', label: 'Stop overspending' },
      { value: 'save', ico: '🪙', label: 'Build a savings habit' },
      { value: 'fam', ico: '👨‍👩‍👧', label: "Manage my family's finances" },
      { value: 'grow', ico: '📈', label: 'Grow my investments' },
      { value: 'all', ico: '🔭', label: 'See everything in one place' },
    ],
  },
]

export default function Onboarding({ onFinish, onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ q1: null, q2: [], q3: null })

  const selectSingle = (key, value) => setAnswers(a => ({ ...a, [key]: value }))
  const toggleMulti = (value) => setAnswers(a => ({
    ...a,
    q2: a.q2.includes(value) ? a.q2.filter(v => v !== value) : [...a.q2, value],
  }))

  const finish = () => {
    const { q1, q2 } = answers
    let tier = 1
    if (q1 === 'retired' || q2.includes('loan') || q2.includes('fd') || q2.includes('mf')) tier = 2
    if ((q2.includes('stocks') || q2.includes('mf')) && q1 !== 'retired') tier = 3
    onFinish(tier)
  }

  const current = STEPS[step]

  const isSelected = (opt) => {
    if (current.type === 'single') return answers[current.key] === opt.value
    return answers.q2.includes(opt.value)
  }

  return (
    <div className="ob-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="ob-modal">
        <div className="ob-title">{current.title}</div>
        <div className="ob-sub">{current.sub}</div>
        <div className="ob-opts">
          {current.opts.map(opt => (
            <div
              key={opt.value}
              className={`ob-opt ${isSelected(opt) ? 'selected' : ''}`}
              onClick={() => current.type === 'single' ? selectSingle(current.key, opt.value) : toggleMulti(opt.value)}
            >
              <span className="ob-opt-ico">{opt.ico}</span>
              <div>
                <div className="ob-opt-label">{opt.label}</div>
                {opt.sub && <div className="ob-opt-sub">{opt.sub}</div>}
              </div>
            </div>
          ))}
        </div>
        {step < 2 ? (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(s => s + 1)}>
            Continue →
          </button>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={finish}>
            Get started →
          </button>
        )}
        <div className="ob-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`ob-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
