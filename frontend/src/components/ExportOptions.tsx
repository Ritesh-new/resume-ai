import React from 'react'
import { exportToPDF } from '../utils/resume'
import { Resume } from '../store/store'

interface ExportOptionsProps {
  resume: Resume
  atsScore: number
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ resume, atsScore }) => {
  const handleExportPDF = () => {
    exportToPDF(resume)
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resume, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resume.personalInfo.fullName}_Resume.json`
    link.click()
  }

  return (
    <div className="export-options">
      <h3>Export Resume</h3>
      <div className="export-buttons">
        <button onClick={handleExportPDF} className="export-btn pdf-btn">
          📄 Export as PDF
        </button>
        <button onClick={handleExportJSON} className="export-btn json-btn">
          💾 Save as JSON
        </button>
      </div>
      <div className="export-info">
        <p>Current ATS Score: <strong>{atsScore}/100</strong></p>
        {atsScore >= 80 && <p className="success-message">✓ Excellent ATS compatibility!</p>}
        {atsScore >= 60 && atsScore < 80 && <p className="warning-message">⚠ Good, but could be improved</p>}
        {atsScore < 60 && <p className="error-message">✗ Needs improvement for ATS systems</p>}
      </div>
    </div>
  )
}
