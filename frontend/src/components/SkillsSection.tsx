import React, { useState } from 'react'

interface SkillsSectionProps {
  skills: string[]
  onChange: (skills: string[]) => void
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onChange }) => {
  const [skillInput, setSkillInput] = useState('')

  const addSkill = () => {
    if (skillInput.trim()) {
      onChange([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="editor-section">
      <h3>Skills</h3>
      <p className="helper-text">Add 5-15 skills for better ATS compatibility</p>
      <div className="skills-input-group">
        <input
          type="text"
          placeholder="Enter a skill (e.g., React, Project Management, Python)"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field"
        />
        <button onClick={addSkill} className="add-btn">
          Add Skill
        </button>
      </div>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            <span>{skill}</span>
            <button onClick={() => removeSkill(index)} className="remove-skill-btn">
              ×
            </button>
          </div>
        ))}
      </div>
      <p className="skill-count">{skills.length} skills added</p>
    </div>
  )
}
