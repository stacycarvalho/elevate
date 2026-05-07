import { useState, useCallback } from 'react'
import { P } from './data/personas'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Home from './components/pages/Home'
import CashFlow from './components/pages/CashFlow'
import Plan from './components/pages/Plan'
import You from './components/pages/You'
import AgentLog from './components/pages/AgentLog'
import AgentDrawer from './components/AgentDrawer'
import Onboarding from './components/Onboarding'
import Toast from './components/Toast'
import BottomNav from './components/BottomNav'

const PAGE_TITLES = {
  cashflow: 'Cash Flow',
  plan: 'Plan',
  you: 'You',
  log: 'Agent log',
}

export default function App() {
  const [currentPersona, setCurrentPersona] = useState('mehul')
  const [currentPage, setCurrentPage] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })

  const showToast = useCallback((msg) => {
    setToast({ message: msg, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }, [])

  const handlePersonaChange = useCallback((persona) => {
    setCurrentPersona(persona)
  }, [])

  const handleObFinish = useCallback((tier) => {
    const personas = ['', 'aarav', 'priya', 'mehul']
    const persona = personas[tier]
    setCurrentPersona(persona)
    setOnboardingOpen(false)
    showToast(`Welcome! ${P[persona].tierLabel} experience loaded.`)
  }, [showToast])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    if (window.innerWidth <= 768) setSidebarOpen(false)
  }, [])

  const activeNavPage = currentPage === 'log' ? 'home' : currentPage
  const topbarTitle = PAGE_TITLES[currentPage] || 'Elevate'

  return (
    <div className="app">
      {sidebarOpen && (
        <div className="sb-overlay show" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        currentPersona={currentPersona}
        currentPage={activeNavPage}
        onPersonaChange={handlePersonaChange}
        onPageChange={handlePageChange}
        open={sidebarOpen}
      />

      <main className="main">
        <Topbar
          title={topbarTitle}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onSetup={() => setOnboardingOpen(true)}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
        />
        <div className="content">
          <div className={`page ${currentPage === 'home' ? 'active' : ''}`}>
            <Home
              key={`home-${currentPersona}`}
              persona={P[currentPersona]}
              onPageChange={handlePageChange}
              onAsk={() => setDrawerOpen(true)}
              showToast={showToast}
            />
          </div>
          <div className={`page ${currentPage === 'log' ? 'active' : ''}`}>
            <AgentLog onBack={() => handlePageChange('home')} showToast={showToast} />
          </div>
          <div className={`page ${currentPage === 'cashflow' ? 'active' : ''}`}>
            <CashFlow key={`cf-${currentPersona}`} persona={P[currentPersona]} showToast={showToast} />
          </div>
          <div className={`page ${currentPage === 'plan' ? 'active' : ''}`}>
            <Plan key={`plan-${currentPersona}`} persona={P[currentPersona]} showToast={showToast} />
          </div>
          <div className={`page ${currentPage === 'you' ? 'active' : ''}`}>
            <You key={`you-${currentPersona}`} persona={P[currentPersona]} showToast={showToast} />
          </div>
        </div>
      </main>

      <button className="fab" onClick={() => setDrawerOpen(true)}>✦ Ask agent</button>
      <BottomNav
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onAsk={() => setDrawerOpen(true)}
        neededCount={P[currentPersona].needed.length}
      />

      <AgentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPage={currentPage}
        persona={P[currentPersona]}
      />

      {onboardingOpen && (
        <Onboarding onFinish={handleObFinish} onClose={() => setOnboardingOpen(false)} />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
