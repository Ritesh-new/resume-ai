import React from 'react'
import { Resume } from '../store/store'

interface TemplateSelectorProps {
  currentTemplate: Resume['template']
  onChange: (template: Resume['template']) => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onChange }) => {
  const templates: Array<{ id: Resume['template']; name: string; description: string }> = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with good ATS compatibility',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional layout, excellent for ATS systems',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple format, maximum ATS score',
    },
  ]

  return (
    <div className="template-selector">
      <h3>Resume Template</h3>
      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${currentTemplate === template.id ? 'active' : ''}`}
            onClick={() => onChange(template.id)}
          >
            <h4>{template.name}</h4>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
