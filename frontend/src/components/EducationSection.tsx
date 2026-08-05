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
        degree: '',
        field: '',
        graduationYear: '',
      },
    ])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index))
  }

  return (
    <div className="editor-section">
      <h3>Education</h3>
      {education.map((edu, index) => (
        <div key={index} className="education-entry">
          <input
            type="text"
            placeholder="School/University"
            value={edu.school}
            onChange={(e) => updateEducation(index, 'school', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Degree (e.g., Bachelor of Science)"
            value={edu.degree}
            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={edu.field}
            onChange={(e) => updateEducation(index, 'field', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Graduation Year"
            value={edu.graduationYear}
            onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
            className="input-field"
          />
          <button onClick={() => removeEducation(index)} className="remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addEducation} className="add-btn">
        + Add Education
      </button>
    </div>
  )
}
