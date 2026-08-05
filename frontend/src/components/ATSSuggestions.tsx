import React from 'react'
import { ATSOptimizationTips } from '../utils/atsHelpers'

export const ATSSuggestions: React.FC = () => {
  return (
    <div className="ats-suggestions">
      <h3>ATS Optimization Tips</h3>
      <div className="tips-list">
        {ATSOptimizationTips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="tip-header">
              <h4>{tip.title}</h4>
              <span className={`importance ${tip.importance.toLowerCase()}`}>
                {tip.importance}
              </span>
            </div>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
