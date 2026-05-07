import { scoreColor } from '../utils'

export default function ScoreRing({ score }) {
  const r = 28
  const c = 2 * Math.PI * r
  const color = scoreColor(score)
  return (
    <div className="score-ring">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--surface2)" strokeWidth="8" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${c * score / 100} ${c * (1 - score / 100)}`}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="score-center">
        <div className="score-num" style={{ color }}>{score}</div>
        <div className="score-sub">/100</div>
      </div>
    </div>
  )
}
