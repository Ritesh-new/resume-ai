import React from 'react'
import { Resume } from '../store/store'

interface EducationSectionProps {
  education: Resume['education']
  onChange: (education: Resume['education']) => void
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, onChange }) => {
  const addEducation = () => {
    onChange([
      ...education,
      {
        school: '',
        course: '',
        percentage: '',
        duration: '',
        degree: '',
        field: '',
        graduationYear: '',
      },
    ])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education]
    const current = { ...updated[index], [field]: value }

    // Keep backwards compatibility fields in sync
    if (field === 'course') {
      current.degree = value
    } else if (field === 'duration') {
      current.graduationYear = value
    }

    updated[index] = current
    onChange(updated)
  }

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index))
  }

  return (
    <div className="editor-section">
      <h3>Education</h3>
      {education.map((edu, index) => (
        <div key={index} className="education-entry" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', background: '#ffffff' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              1. School / College Name
            </label>
            <input
              type="text"
              placeholder="e.g. Stanford University, ABC College of Engineering"
              value={edu.school || ''}
              onChange={(e) => updateEducation(index, 'school', e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              2. Course Name
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech Computer Science, B.Com, High School (Class XII)"
              value={edu.course ?? edu.degree ?? ''}
              onChange={(e) => updateEducation(index, 'course', e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                3. Percentage / CGPA
              </label>
              <input
                type="text"
                placeholder="e.g. 8.5 CGPA or 85%"
                value={edu.percentage || ''}
                onChange={(e) => updateEducation(index, 'percentage', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                4. Course Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 2020 - 2024 or 4 Years"
                value={edu.duration ?? edu.graduationYear ?? ''}
                onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <button onClick={() => removeEducation(index)} className="remove-btn">
            ✕ Remove Education
          </button>
        </div>
      ))}
      <button onClick={addEducation} className="add-btn">
        + Add Education
      </button>
    </div>
  )
}
