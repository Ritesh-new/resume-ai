import React from 'react'
import { Resume } from '../store/store'

interface ExperienceSectionProps {
  experience: Resume['experience']
  onChange: (experience: Resume['experience']) => void
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, onChange }) => {
  const addExperience = () => {
    onChange([
      ...experience,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ])
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index))
  }

  return (
    <div className="editor-section">
      <h3>Experience</h3>
      {experience.map((exp, index) => (
        <div key={index} className="experience-entry">
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => updateExperience(index, 'company', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Position"
            value={exp.position}
            onChange={(e) => updateExperience(index, 'position', e.target.value)}
            className="input-field"
          />
          <div className="date-inputs">
            <input
              type="text"
              placeholder="Start Date (MM/YYYY)"
              value={exp.startDate}
              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="End Date (MM/YYYY)"
              value={exp.endDate}
              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
              className="input-field"
            />
          </div>
          <textarea
            placeholder="Job Description (Use action verbs like 'Managed', 'Developed', 'Led')"
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            className="input-field"
            rows={3}
          />
          <button onClick={() => removeExperience(index)} className="remove-btn">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addExperience} className="add-btn">
        + Add Experience
      </button>
    </div>
  )
}
