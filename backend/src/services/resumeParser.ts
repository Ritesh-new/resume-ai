import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import { ResumeData } from './atsOptimization'

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
  'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Express', 'Express.js',
  'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Laravel',
  'HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Elasticsearch', 'DynamoDB', 'Firebase',
  'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'GitLab', 'Terraform',
  'Linux', 'Unix', 'REST', 'RESTful API', 'GraphQL', 'gRPC', 'WebSockets', 'Microservices',
  'Jest', 'Mocha', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'TDD',
  'Agile', 'Scrum', 'Jira', 'Figma', 'UI/UX', 'Machine Learning', 'Data Analysis', 'Deep Learning', 'Pandas', 'NumPy'
]

export class ResumeParserService {
  /**
   * Extract raw text from file buffer based on mimetype and filename
   */
  async extractTextFromFile(buffer: Buffer, mimetype: string, originalname: string): Promise<string> {
    const ext = originalname.toLowerCase().split('.').pop()

    if (mimetype === 'application/pdf' || ext === 'pdf') {
      const parser = new PDFParse({ data: buffer })
      try {
        const data = await parser.getText()
        return data.text || ''
      } finally {
        await parser.destroy()
      }
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer })
      return result.value || ''
    }

    if (mimetype === 'application/json' || ext === 'json') {
      return buffer.toString('utf-8')
    }

    // Default: plain text / markdown
    return buffer.toString('utf-8')
  }

  /**
   * Parse extracted raw text or JSON string into structured ResumeData
   */
  parseResumeText(text: string): ResumeData {
    const trimmed = text.trim()

    // Check if it's already a JSON export
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed.personalInfo || parsed.experience || parsed.education || parsed.skills) {
          return {
            title: parsed.title || 'Extracted Resume',
            personalInfo: {
              fullName: parsed.personalInfo?.fullName || '',
              email: parsed.personalInfo?.email || '',
              phone: parsed.personalInfo?.phone || '',
              location: parsed.personalInfo?.location || '',
              summary: parsed.personalInfo?.summary || '',
            },
            experience: Array.isArray(parsed.experience) ? parsed.experience : [],
            education: Array.isArray(parsed.education) ? parsed.education : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
            template: parsed.template || 'modern',
          }
        }
      } catch {
        // Fall back to text parsing if JSON parse fails
      }
    }

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    const email = this.extractEmail(text)
    const phone = this.extractPhone(text)
    const fullName = this.extractName(lines, email)
    const location = this.extractLocation(text, lines)
    const sections = this.extractSections(lines)
    const summary = this.extractSummary(sections, text)
    const skills = this.extractSkills(sections, text)
    const experience = this.extractExperience(sections)
    const education = this.extractEducation(sections)

    return {
      title: fullName ? `${fullName}'s Resume` : 'Extracted Resume',
      personalInfo: {
        fullName: fullName || '',
        email: email || '',
        phone: phone || '',
        location: location || '',
        summary: summary || '',
      },
      experience,
      education,
      skills,
      template: 'modern',
    }
  }

  private extractEmail(text: string): string {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    return match ? match[0] : ''
  }

  private extractPhone(text: string): string {
    const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,14}/)
    return match ? match[0] : ''
  }

  private extractName(lines: string[], email: string): string {
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i]
      if (
        line.length > 2 &&
        line.length < 45 &&
        !line.includes('@') &&
        !line.match(/resume|curriculum|vitae|page|phone|email|linkedin|github/i) &&
        !line.match(/\d/)
      ) {
        // Capitalized words check
        const words = line.split(/\s+/)
        if (words.length >= 2 && words.length <= 4) {
          return line
        }
      }
    }

    // Fallback: derive from email username if available
    if (email) {
      const userPart = email.split('@')[0]
      const nameParts = userPart.split(/[._-]/).filter((p) => isNaN(Number(p)))
      if (nameParts.length >= 2) {
        return nameParts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      }
    }

    return lines[0] || 'Candidate Name'
  }

  private extractLocation(text: string, lines: string[]): string {
    // Look for City, State / Country patterns like "New York, NY" or "Seattle, WA" or "London, UK"
    const match = text.match(/([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Z][a-zA-Z]+)(?:\s+\d{5})?/)
    if (match && !match[0].toLowerCase().includes('university') && !match[0].toLowerCase().includes('college')) {
      return match[0].trim()
    }

    // Check first 8 lines for location-like tokens
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      if (lines[i].includes(',') && !lines[i].includes('@') && lines[i].length < 40) {
        return lines[i]
      }
    }

    return ''
  }

  private extractSections(lines: string[]): Record<string, string[]> {
    const sections: Record<string, string[]> = {
      header: [],
      summary: [],
      experience: [],
      education: [],
      skills: [],
      other: [],
    }

    let currentSection = 'header'

    const sectionPatterns: Array<{ name: string; regex: RegExp }> = [
      { name: 'summary', regex: /^(?:professional\s+)?(?:summary|profile|about(?:\s+me)?|objective)\b/i },
      { name: 'experience', regex: /^(?:work\s+|professional\s+)?(?:experience|employment(?:\s+history)?|work\s+history)\b/i },
      { name: 'education', regex: /^(?:education|academic(?:\s+background)?|qualifications)\b/i },
      { name: 'skills', regex: /^(?:technical\s+|core\s+)?(?:skills|technologies|competencies|tools\s*(?:&|and)\s*technologies)\b/i },
      { name: 'other', regex: /^(?:projects|certifications|awards|languages|interests)\b/i },
    ]

    for (const line of lines) {
      const trimmed = line.trim()
      let matchedSection = false

      for (const sec of sectionPatterns) {
        if (sec.regex.test(trimmed)) {
          currentSection = sec.name
          matchedSection = true
          break
        }
      }

      if (!matchedSection) {
        sections[currentSection].push(trimmed)
      }
    }

    return sections
  }

  private extractSummary(sections: Record<string, string[]>, fullText: string): string {
    if (sections.summary.length > 0) {
      return sections.summary.join(' ')
    }

    // Fallback: look for paragraph after name and before experience
    const headerLines = sections.header.slice(2)
    const longHeader = headerLines.find((l) => l.length > 50 && !l.includes('@'))
    if (longHeader) return longHeader

    return ''
  }

  private extractSkills(sections: Record<string, string[]>, fullText: string): string[] {
    const skillSet = new Set<string>()

    // Check skill section lines first
    if (sections.skills.length > 0) {
      for (const line of sections.skills) {
        const parts = line.split(/[,•|·/;\n]+/).map((s) => s.trim()).filter((s) => s.length > 0)
        for (const part of parts) {
          // If it matches a known skill or is short clean token
          if (part.length <= 30 && !part.includes(':')) {
            skillSet.add(part)
          } else if (part.includes(':')) {
            const afterColon = part.split(':')[1]
            if (afterColon) {
              afterColon.split(/[,•|·/]+/).map((s) => s.trim()).filter(Boolean).forEach((s) => skillSet.add(s))
            }
          }
        }
      }
    }

    // Also scan entire text for known tech skills
    for (const skill of COMMON_SKILLS) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (regex.test(fullText)) {
        skillSet.add(skill)
      }
    }

    return Array.from(skillSet).slice(0, 20)
  }

  private extractExperience(sections: Record<string, string[]>): ResumeData['experience'] {
    const expLines = sections.experience
    if (expLines.length === 0) return []

    const items: ResumeData['experience'] = []
    let currentItem: ResumeData['experience'][0] | null = null

    const dateRegex = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})\s*[-–—to]+\s*(Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})\b/i

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i]
      const dateMatch = line.match(dateRegex)

      if (dateMatch) {
        if (currentItem) items.push(currentItem)

        let position = ''
        let company = ''
        const textWithoutDate = line.replace(dateRegex, '').trim()

        let titleLine = textWithoutDate
        if (!titleLine && i > 0) {
          titleLine = expLines[i - 1]
        }

        if (titleLine.includes(' at ')) {
          const parts = titleLine.split(' at ')
          position = parts[0].trim()
          company = parts[1].trim()
        } else if (titleLine.includes(' - ') || titleLine.includes(' | ')) {
          const parts = titleLine.split(/[-|]/)
          position = parts[0].trim()
          company = parts[1]?.trim() || ''
        } else {
          position = titleLine || 'Software Engineer'
          company = 'Company'
        }

        currentItem = {
          position: position || 'Role',
          company: company || 'Company',
          startDate: dateMatch[1] || '',
          endDate: dateMatch[2] || '',
          description: '',
        }
      } else if (currentItem) {
        if (!currentItem.description) {
          currentItem.description = line
        } else {
          currentItem.description += ' ' + line
        }
      }
    }

    if (currentItem) items.push(currentItem)

    // Fallback if no structured dates found but experience lines exist
    if (items.length === 0 && expLines.length > 0) {
      items.push({
        company: 'Company',
        position: 'Professional Role',
        startDate: '2021',
        endDate: 'Present',
        description: expLines.join(' ').slice(0, 300),
      })
    }

    return items.slice(0, 5)
  }

  private extractEducation(sections: Record<string, string[]>): ResumeData['education'] {
    const eduLines = sections.education
    if (eduLines.length === 0) return []

    const items: ResumeData['education'] = []
    const degreeRegex = /\b(Bachelor(?:'s)?(?:\s+of\s+[A-Za-z]+)?|Master(?:'s)?(?:\s+of\s+[A-Za-z]+)?|Ph\.?D\.?|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Com|B\.?B\.?A|M\.?B\.?A|B\.?C\.?A|M\.?C\.?A|Associate(?:'s)?|Diploma|Class\s*(?:XII|X|12th|10th)|Higher\s*Secondary)\b/i
    const durationRegex = /\b((?:19|20)\d{2}\s*[-–—to]+\s*(?:Present|(?:19|20)\d{2})|(?:19|20)\d{2})\b/i
    const scoreRegex = /\b((?:CGPA|GPA|Percentage|Score)?\s*:?\s*(?:(?:\d{1,2}(?:\.\d{1,2})?\s*%)|(?:[1-9]\.\d{1,2}|10(?:\.0{1,2})?)\s*(?:\/\s*10)?\s*(?:CGPA)?|(?:[1-4]\.\d{1,2}|4\.0)\s*(?:\/\s*4)?\s*(?:GPA)?))\b/i

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i]
      const degreeMatch = line.match(degreeRegex)
      const durationMatch = line.match(durationRegex)
      const scoreMatch = line.match(scoreRegex)

      if (degreeMatch || line.match(/university|college|institute|school|academy/i)) {
        let degree = degreeMatch ? degreeMatch[0] : 'Bachelor Degree'
        let field = ''
        if (line.match(/in\s+([A-Za-z\s]+)/i)) {
          const fieldMatch = line.match(/in\s+([A-Za-z\s]+)/i)
          if (fieldMatch) field = fieldMatch[1].replace(/,|\./g, '').trim()
        }

        const courseName = field ? `${degree} in ${field}` : degree

        let percentage = scoreMatch ? scoreMatch[0].trim() : ''
        if (!percentage && i + 1 < eduLines.length) {
          const nextScore = eduLines[i + 1].match(scoreRegex)
          if (nextScore) percentage = nextScore[0].trim()
        }

        let duration = durationMatch ? durationMatch[0] : ''
        if (!duration && i + 1 < eduLines.length) {
          const nextDuration = eduLines[i + 1].match(durationRegex)
          if (nextDuration) duration = nextDuration[0]
        }

        // Check for school/university name
        let school = line
          .replace(degreeRegex, '')
          .replace(durationRegex, '')
          .replace(scoreRegex, '')
          .replace(/in\s+[A-Za-z\s]+/i, '')
          .replace(/[-–—|,()]/g, ' ')
          .trim()

        if (!school || school.length < 3) {
          if (i + 1 < eduLines.length && !eduLines[i + 1].match(degreeRegex)) {
            school = eduLines[i + 1]
              .replace(durationRegex, '')
              .replace(scoreRegex, '')
              .replace(/[-–—|,()]/g, ' ')
              .trim()
          }
        }

        if (!school || school.length < 3) school = 'University / College'

        items.push({
          school,
          course: courseName,
          percentage: percentage || 'N/A',
          duration: duration || '2020 - 2024',
          degree,
          field: field || 'General',
          graduationYear: duration || '2024',
        })
      }
    }

    if (items.length === 0 && eduLines.length > 0) {
      items.push({
        school: eduLines[0] || 'College / University',
        course: 'Degree Program',
        percentage: 'N/A',
        duration: '2020 - 2024',
        degree: 'Bachelor Degree',
        field: 'General',
        graduationYear: '2024',
      })
    }

    return items.slice(0, 4)
  }
}

export const resumeParserService = new ResumeParserService()
