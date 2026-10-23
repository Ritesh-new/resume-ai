import jsPDF from 'jspdf'
import { Resume } from '../store/store'

export const exportToPDF = (resume: Resume) => {
  const doc = new jsPDF()
  
  // Use standard font for ATS compatibility
  doc.setFont('Courier')
  
  let yPosition = 10
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 10
  const lineHeight = 7
  
  // Personal Info
  doc.setFontSize(16)
  doc.text(resume.personalInfo.fullName, margin, yPosition)
  
  yPosition += lineHeight + 2
  doc.setFontSize(10)
  
  const contact = `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}`
  doc.text(contact, margin, yPosition)
  
  yPosition += lineHeight + 5
  
  // Summary
  if (resume.personalInfo.summary) {
    doc.setFontSize(11)
    doc.setFont('Courier', 'bold')
    doc.text('PROFESSIONAL SUMMARY', margin, yPosition)
    
    yPosition += lineHeight + 1
    doc.setFont('Courier', 'normal')
    doc.setFontSize(10)
    
    const summaryLines = doc.splitTextToSize(resume.personalInfo.summary, pageWidth - margin * 2)
    doc.text(summaryLines, margin, yPosition)
    yPosition += summaryLines.length * lineHeight + 3
  }
  
  // Experience
  if (resume.experience && resume.experience.length > 0) {
    doc.setFontSize(11)
    doc.setFont('Courier', 'bold')
    doc.text('EXPERIENCE', margin, yPosition)
    yPosition += lineHeight + 1
    
    doc.setFontSize(10)
    doc.setFont('Courier', 'normal')
    
    resume.experience.forEach((job) => {
      doc.setFont('Courier', 'bold')
      doc.text(`${job.position} at ${job.company}`, margin, yPosition)
      yPosition += lineHeight
      
      doc.setFont('Courier', 'normal')
      doc.text(`${job.startDate} - ${job.endDate}`, margin, yPosition)
      yPosition += lineHeight + 1
      
      const descLines = doc.splitTextToSize(job.description, pageWidth - margin * 2)
      doc.text(descLines, margin, yPosition)
      yPosition += descLines.length * lineHeight + 2
    })
  }
  
  // Education
  if (resume.education && resume.education.length > 0) {
    doc.setFontSize(11)
    doc.setFont('Courier', 'bold')
    doc.text('EDUCATION', margin, yPosition)
    yPosition += lineHeight + 1
    
    doc.setFont('Courier', 'normal')
    doc.setFontSize(10)
    
    resume.education.forEach((edu) => {
      doc.setFont('Courier', 'bold')
      const courseTitle = edu.course || (edu.degree ? `${edu.degree}${edu.field ? ' in ' + edu.field : ''}` : 'Education')
      const durationText = edu.duration || edu.graduationYear || ''
      doc.text(`${courseTitle}${durationText ? ' | ' + durationText : ''}`, margin, yPosition)
      yPosition += lineHeight
      
      doc.setFont('Courier', 'normal')
      const detailsText = `${edu.school}${edu.percentage ? ' - Score: ' + edu.percentage : ''}`
      doc.text(detailsText, margin, yPosition)
      yPosition += lineHeight + 2
    })
  }
  
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    doc.setFontSize(11)
    doc.setFont('Courier', 'bold')
    doc.text('SKILLS', margin, yPosition)
    yPosition += lineHeight + 1
    
    doc.setFont('Courier', 'normal')
    doc.setFontSize(10)
    const skillsText = resume.skills.join(', ')
    const skillsLines = doc.splitTextToSize(skillsText, pageWidth - margin * 2)
    doc.text(skillsLines, margin, yPosition)
  }
  
  doc.save(`${resume.personalInfo.fullName}_Resume.pdf`)
}

export const calculateATSScore = (resume: Resume): number => {
  let score = 0
  
  // Personal Info (15 points)
  if (resume.personalInfo.fullName) score += 3
  if (resume.personalInfo.email) score += 3
  if (resume.personalInfo.phone) score += 3
  if (resume.personalInfo.location) score += 3
  if (resume.personalInfo.summary?.length > 50) score += 3
  
  // Experience (30 points)
  if (resume.experience?.length > 0) {
    score += 10
    resume.experience.forEach((exp) => {
      if (exp.company && exp.position && exp.description?.length > 50) score += 5
    })
  }
  
  // Education (20 points)
  if (resume.education?.length > 0) {
    score += 10
    resume.education.forEach((edu) => {
      if (edu.school && edu.degree && edu.field) score += 5
    })
  }
  
  // Skills (20 points)
  if (resume.skills?.length >= 5) score += 10
  if (resume.skills?.length >= 10) score += 10
  
  // Keywords (15 points)
  const allText = JSON.stringify(resume).toLowerCase()
  const keywords = [
    'experienced', 'managed', 'developed', 'implemented', 'led', 'designed',
    'improved', 'increased', 'reduced', 'optimized', 'collaborated'
  ]
  const keywordMatches = keywords.filter(kw => allText.includes(kw)).length
  score += Math.min(15, keywordMatches * 1.5)
  
  return Math.min(100, Math.round(score))
}
