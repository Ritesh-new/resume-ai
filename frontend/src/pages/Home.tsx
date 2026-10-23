import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import { AuthModal } from '../components/AuthModal'
import '../styles/pages.css'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleStartBuilding = () => {
    if (isAuthenticated) {
      navigate('/editor')
    } else {
      setShowAuthModal(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-brand">Resume Builder</div>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Hi, {user?.name || 'User'}</span>
              <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
              <button onClick={() => navigate('/editor')} className="nav-btn">New Resume</button>
              <button onClick={handleLogout} className="nav-btn nav-btn-outline">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuthModal(true)} className="nav-btn">Sign In</button>
              <button onClick={() => setShowAuthModal(true)} className="nav-btn nav-btn-primary">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      <header className="hero-section">
        <h1>Build Your <span>Modern Resume</span></h1>
        <p>Create a professional, ATS-optimized resume that gets you hired. Clean design, smart scoring, instant export.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <button onClick={handleStartBuilding} className="cta-button">
            {isAuthenticated ? 'Start Building' : 'Get Started'}
          </button>
          <button onClick={() => navigate('/editor')} className="cta-button" style={{ background: '#059669', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' }}>
            📁 Upload & Extract File
          </button>
        </div>
      </header>

      <section className="features">
        <h2>Why Choose Our Resume Builder?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>ATS Optimized</h3>
            <p>Our templates are designed to pass Applicant Tracking System scans</p>
          </div>
          <div className="feature-card">
            <h3>Multiple Templates</h3>
            <p>Choose from professional templates that look great while being ATS-friendly</p>
          </div>
          <div className="feature-card">
            <h3>Easy Export</h3>
            <p>Download your resume as PDF or DOCX instantly</p>
          </div>
          <div className="feature-card">
            <h3>ATS Score</h3>
            <p>Get real-time feedback on your resume's ATS compatibility score</p>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

export default Home
