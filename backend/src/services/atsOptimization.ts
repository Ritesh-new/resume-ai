import { Resume as ResumeType } from '../models/Resume'

export interface ResumeData {
  title: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    graduationYear: string
  }>
  skills: string[]
  template: 'modern' | 'classic' | 'minimal'
}

export class ATSOptimizationService {
  calculateATSScore(resume: ResumeData): number {
    let score = 0

    // Personal Information (15 points)
    if (resume.personalInfo.fullName && resume.personalInfo.fullName.length > 0) score += 3
    if (resume.personalInfo.email && resume.personalInfo.email.length > 0) score += 3
    if (resume.personalInfo.phone && resume.personalInfo.phone.length > 0) score += 3
    if (resume.personalInfo.location && resume.personalInfo.location.length > 0) score += 3
    if (resume.personalInfo.summary && resume.personalInfo.summary.length > 50) score += 3

    // Experience (30 points)
    if (resume.experience && resume.experience.length > 0) {
      score += 10
      resume.experience.forEach((exp) => {
        if (exp.company && exp.position && exp.description && exp.description.length > 50) {
          score += 5
        }
      })
    }

    // Education (20 points)
    if (resume.education && resume.education.length > 0) {
      score += 10
      resume.education.forEach((edu) => {
        if (edu.school && edu.degree && edu.field) {
          score += 5
        }
      })
    }

    // Skills (20 points)
    if (resume.skills && resume.skills.length >= 5) score += 10
    if (resume.skills && resume.skills.length >= 10) score += 10

    // Action Verbs & Keywords (15 points)
    const actionVerbs = [
      'managed',
      'developed',
      'implemented',
      'led',
      'designed',
      'improved',
      'increased',
      'reduced',
      'optimized',
      'collaborated',
      'created',
      'achieved',
      'enhanced',
      'streamlined',
      'orchestrated',
    ]

    const allText = JSON.stringify(resume).toLowerCase()
    const verbMatches = actionVerbs.filter((verb) => allText.includes(verb)).length
    score += Math.min(15, verbMatches * 1.5)

    return Math.min(100, Math.round(score))
  }

  getATSIssues(resume: ResumeData): string[] {
    const issues: string[] = []

    // Check for missing sections
    if (!resume.personalInfo.fullName) issues.push('Missing full name')
    if (!resume.personalInfo.email) issues.push('Missing email address')
    if (!resume.personalInfo.phone) issues.push('Missing phone number')
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50)
      issues.push('Professional summary is too short or missing')

    if (!resume.experience || resume.experience.length === 0)
      issues.push('No work experience listed')
    if (!resume.education || resume.education.length === 0)
      issues.push('No education listed')
    if (!resume.skills || resume.skills.length < 5)
      issues.push('Less than 5 skills listed (recommended: 5-15)')

    // Check for weak descriptions
    if (resume.experience) {
      resume.experience.forEach((exp, index) => {
        if (exp.description && exp.description.length < 50) {
          issues.push(`Job description #${index + 1} is too short`)
        }
      })
    }

    return issues
  }

  getATSSuggestions(resume: ResumeData): string[] {
    const suggestions: string[] = []

    // Check for action verbs
    const allText = JSON.stringify(resume).toLowerCase()
    const hasActionVerbs =
      allText.includes('managed') ||
      allText.includes('developed') ||
      allText.includes('implemented') ||
      allText.includes('led')

    if (!hasActionVerbs) {
      suggestions.push('Use action verbs like "Managed", "Developed", "Led", "Implemented"')
    }

    // Check for quantifiable achievements
    const hasNumbers = /\d+/.test(allText)
    if (!hasNumbers) {
      suggestions.push('Include quantifiable results (e.g., "Increased sales by 25%")')
    }

    // Check for specific skills
    if (resume.skills && resume.skills.length < 10) {
      suggestions.push('Consider adding more skills (aim for 10-15 skills)')
    }

    // Check for dates
    const hasDates = resume.experience.every((exp) => exp.startDate && exp.endDate)
    if (!hasDates) {
      suggestions.push('Ensure all jobs have start and end dates')
    }

    return suggestions
  }
}

export const atsOptimizationService = new ATSOptimizationService()
