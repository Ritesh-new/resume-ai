import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store'
import api from '../utils/api'
import '../styles/pages.css'

function Dashboard() {
  const navigate = useNavigate()
  const { resumes, setResumes, user } = useStore()
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes')
      setResumes(response.data)
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  if (loading) {
    return <div className="dashboard-page">Loading...</div>
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="navbar-brand">Resume Builder</div>
        <div className="navbar-links">
          <span className="navbar-user">Hi, {user?.name || 'User'}</span>
          <button onClick={() => navigate('/editor')} className="nav-btn nav-btn-primary">New Resume</button>
          <button onClick={() => navigate('/')} className="nav-btn">Home</button>
          <button onClick={handleLogout} className="nav-btn nav-btn-outline">Logout</button>
        </div>
      </nav>

      <div className="dashboard-header">
        <h1>My Resumes</h1>
        <button onClick={() => navigate('/editor')} className="create-btn">+ Create New Resume</button>
      </div>
      
      {resumes.length === 0 ? (
        <div className="empty-state">
          <p>No resumes yet. Create your first resume to get started!</p>
          <button onClick={() => navigate('/editor')} className="create-btn">Create Your First Resume</button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map((resume) => (
            <div key={resume._id} className="resume-card" onClick={() => navigate(`/editor/${resume._id}`)}>
              <h3>{resume.title}</h3>
              <p>{resume.personalInfo.fullName}</p>
              <div className="card-footer">
                <span className="template-badge">{resume.template}</span>
                {resume.atsScore !== undefined && (
                  <span className="ats-score">ATS: {resume.atsScore}/100</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
