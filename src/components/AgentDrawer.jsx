import { useState, useRef, useEffect } from 'react'
import { aiResponses } from '../data/transactions'

export default function AgentDrawer({ open, onClose, currentPage, persona, initialMessage }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const msgsRef = useRef(null)
  const sentInitial = useRef(false)

  useEffect(() => {
    if (open) {
      sentInitial.current = false
      const greeting = { role: 'ai', text: `Hi ${persona.first}! I'm watching your finances around the clock. Ask me anything.` }
      if (initialMessage) {
        setMessages([greeting, { role: 'user', text: `Explain this: "${initialMessage}"` }])
        setTimeout(() => {
          const key = Object.keys(aiResponses).find(k => initialMessage.toLowerCase().includes(k)) || 'default'
          setMessages(m => [...m, { role: 'ai', text: aiResponses[key] }])
        }, 500)
      } else {
        setMessages([greeting])
      }
    }
  }, [open, persona.first, initialMessage])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = 9999
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const text = input.toLowerCase()
    const userMsg = input
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => text.includes(k)) || 'default'
      setMessages(m => [...m, { role: 'ai', text: aiResponses[key] }])
    }, 500)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className={`overlay ${open ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="drawer">
        <div className="drawer-handle" />
        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>✦ Ask your financial agent</div>
        <div style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '14px' }}>
          Context: you're on the {currentPage} page.
        </div>
        <div className="conv-msgs" ref={msgsRef} style={{ maxHeight: '240px' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`conv-msg ${msg.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="conv-wrap">
          <textarea
            className="conv-input"
            placeholder="Ask anything about your finances…"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="conv-send" onClick={send}>↑</button>
        </div>
      </div>
    </div>
  )
}
