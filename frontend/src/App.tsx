import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/store'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, initializeAuth } = useStore()

  useEffect(() => {
    initializeAuth()
    setIsLoading(false)
  }, [initializeAuth])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id?" element={isAuthenticated ? <Editor /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
