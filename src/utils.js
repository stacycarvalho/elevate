export function fmt(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toLocaleString('en-IN')
}

export function scoreColor(s) {
  return s >= 70 ? 'var(--ok)' : s >= 50 ? 'var(--warn)' : 'var(--danger)'
}
