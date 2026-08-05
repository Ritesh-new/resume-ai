import { useState, useEffect } from 'react'
import { useStore, Resume } from '../store/store'
import { calculateATSScore } from '../utils/resume'
import { ExperienceSection } from '../components/ExperienceSection'
import { EducationSection } from '../components/EducationSection'
import { SkillsSection } from '../components/SkillsSection'
import { TemplateSelector } from '../components/TemplateSelector'
import { ExportOptions } from '../components/ExportOptions'
import { ATSSuggestions } from '../components/ATSSuggestions'
import '../styles/pages.css'

function Editor() {
  const { currentResume, setCurrentResume } = useStore()
  const [atsScore, setATSScore] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize with default resume if none exists
  useEffect(() => {
    if (!currentResume) {
      const defaultResume: Resume = {
        title: 'My Resume',
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
        template: 'modern',
      }
      setCurrentResume(defaultResume)
    }
  }, [currentResume, setCurrentResume])

  // Update ATS score whenever resume changes
  useEffect(() => {
    if (currentResume) {
      const score = calculateATSScore(currentResume)
      setATSScore(score)
    }
  }, [currentResume])

  if (!currentResume) {
    return <div className="editor-page">Loading resume...</div>
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCurrentResume({
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        [field]: value,
      },
    })
  }

  const handleExperience = (experience: Resume['experience']) => {
    setCurrentResume({
      ...currentResume,
      experience,
    })
  }

  const handleEducation = (education: Resume['education']) => {
    setCurrentResume({
      ...currentResume,
      education,
    })
  }

  const handleSkills = (skills: string[]) => {
    setCurrentResume({
      ...currentResume,
      skills,
    })
  }

  const handleTemplate = (template: Resume['template']) => {
    setCurrentResume({
      ...currentResume,
      template,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Save to backend API
      console.log('Saving resume:', currentResume)
      alert('Resume saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save resume')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="editor-page">
      <div className="editor-container">
        <div className="editor-sidebar">
          <h2>Edit Resume</h2>
          
          {/* Personal Info Section */}
          <section className="editor-section">
            <h3>Personal Information</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={currentResume.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={currentResume.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={currentResume.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Location"
              value={currentResume.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Professional Summary (50+ characters recommended)"
              value={currentResume.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              className="input-field"
              rows={4}
            />
          </section>

          {/* Experience Section */}
          <ExperienceSection
            experience={currentResume.experience}
            onChange={handleExperience}
          />

          {/* Education Section */}
          <EducationSection
            education={currentResume.education}
            onChange={handleEducation}
          />

          {/* Skills Section */}
          <SkillsSection
            skills={currentResume.skills}
            onChange={handleSkills}
          />

          {/* Template Selector */}
          <TemplateSelector
            currentTemplate={currentResume.template}
            onChange={handleTemplate}
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="add-btn"
            style={{ marginTop: '20px' }}
          >
            {isSaving ? 'Saving...' : '💾 Save Resume'}
          </button>
        </div>

        <div className="editor-preview">
          {/* ATS Score Card */}
          <div className="ats-score-card">
            <h3>ATS Score</h3>
            <div className="score-display">
              <span className="score-number">{atsScore}/100</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${atsScore}%` }}></div>
              </div>
            </div>
            {atsScore >= 80 && <p className="score-status excellent">✓ Excellent ATS Compatibility!</p>}
            {atsScore >= 60 && atsScore < 80 && <p className="score-status good">⚠ Good, but can improve</p>}
            {atsScore < 60 && <p className="score-status needs-work">✗ Needs improvement</p>}
          </div>

          {/* Preview Content - Modern Resume Style */}
          <div className="preview-content">
            <div className="preview-header">
              <h2>{currentResume.personalInfo.fullName || 'Your Name'}</h2>
              <div className="contact-line">
                {currentResume.personalInfo.email && <span>{currentResume.personalInfo.email}</span>}
                {currentResume.personalInfo.phone && <><span className="separator">•</span><span>{currentResume.personalInfo.phone}</span></>}
                {currentResume.personalInfo.location && <><span className="separator">•</span><span>{currentResume.personalInfo.location}</span></>}
              </div>
            </div>

            {currentResume.personalInfo.summary && (
              <div className="preview-section">
                <h3>Professional Summary</h3>
                <p className="summary-text">{currentResume.personalInfo.summary}</p>
              </div>
            )}

            {currentResume.experience && currentResume.experience.length > 0 && (
              <div className="preview-section">
                <h3>Experience</h3>
                {currentResume.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="item-header">
                      <span className="item-title">{exp.position} at {exp.company}</span>
                      {exp.startDate && <span className="item-subtitle">{exp.startDate} - {exp.endDate || 'Present'}</span>}
                    </div>
                    <p className="item-description">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {currentResume.education && currentResume.education.length > 0 && (
              <div className="preview-section">
                <h3>Education</h3>
                {currentResume.education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <div className="item-header">
                      <span className="item-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                      {edu.graduationYear && <span className="item-subtitle">{edu.graduationYear}</span>}
                    </div>
                    <p className="item-details">{edu.school}</p>
                  </div>
                ))}
              </div>
            )}

            {currentResume.skills && currentResume.skills.length > 0 && (
              <div className="preview-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {currentResume.skills.map((skill, index) => (
                    <span key={index} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          <ExportOptions
            resume={currentResume}
            atsScore={atsScore}
          />
        </div>
      </div>

      {/* ATS Suggestions */}
      <ATSSuggestions />
    </div>
  )
}

export default Editor
