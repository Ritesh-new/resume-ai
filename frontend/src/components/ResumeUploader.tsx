import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useStore, Resume } from '../store/store'

interface ResumeUploaderProps {
  onUploadSuccess?: (resume: Resume) => void
  compact?: boolean
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess, compact = false }) => {
  const { setCurrentResume } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<{
    fileName: string
    name: string
    skillsCount: number
    experienceCount: number
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setError(null)
    setSuccessInfo(null)

    const validExtensions = ['.pdf', '.docx', '.txt', '.json', '.md']
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validExtensions.includes(fileExt)) {
      setError(`Unsupported file type (${fileExt}). Please upload a PDF, DOCX, TXT, or JSON file.`)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller file.')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Post to backend extraction endpoint
      const response = await axios.post('/api/resumes/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data && response.data.success && response.data.resume) {
        const extracted: Resume = response.data.resume
        setCurrentResume(extracted)
        setSuccessInfo({
          fileName: file.name,
          name: extracted.personalInfo?.fullName || 'Extracted Profile',
          skillsCount: extracted.skills?.length || 0,
          experienceCount: extracted.experience?.length || 0,
        })
        if (onUploadSuccess) {
          onUploadSuccess(extracted)
        }
      } else {
        throw new Error(response.data?.error || 'Extraction failed')
      }
    } catch (err: any) {
      console.warn('Backend extraction error, trying client-side fallback if applicable:', err)

      // Fallback for JSON files on client side
      if (fileExt === '.json') {
        try {
          const text = await file.text()
          const parsed = JSON.parse(text)
          if (parsed.personalInfo || parsed.experience || parsed.education || parsed.skills) {
            const fallbackResume: Resume = {
              title: parsed.title || `${parsed.personalInfo?.fullName || 'Imported'} Resume`,
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
            setCurrentResume(fallbackResume)
            setSuccessInfo({
              fileName: file.name,
              name: fallbackResume.personalInfo.fullName || 'Imported JSON',
              skillsCount: fallbackResume.skills.length,
              experienceCount: fallbackResume.experience.length,
            })
            if (onUploadSuccess) onUploadSuccess(fallbackResume)
            setIsLoading(false)
            return
          }
        } catch (jsonErr) {
          console.error('Failed to parse JSON file:', jsonErr)
        }
      }

      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Failed to extract resume details. Please ensure the backend is running and the file is not corrupted.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className={`resume-uploader-container ${compact ? 'compact' : ''}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.json,.md"
        style={{ display: 'none' }}
      />

      <div
        className={`resume-dropzone ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="upload-loading-state">
            <div className="upload-spinner"></div>
            <p className="loading-title">Extracting Details from Resume...</p>
            <p className="loading-subtitle">Analyzing personal info, experience, education, and skills</p>
          </div>
        ) : (
          <div className="upload-idle-state">
            <div className="upload-icon">📄</div>
            <div className="upload-text">
              <span className="upload-main-text">
                <strong>Click to upload</strong> or drag and drop your resume
              </span>
              <span className="upload-sub-text">
                Supports <strong>PDF, DOCX, TXT, JSON</strong> (up to 10MB)
              </span>
            </div>
            <button
              type="button"
              className="upload-browse-btn"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Select Resume File
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error-alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successInfo && (
        <div className="upload-success-alert">
          <div className="success-header">
            <span className="success-icon">✓</span>
            <strong>Successfully extracted from {successInfo.fileName}!</strong>
          </div>
          <div className="success-meta">
            <span>Name: <strong>{successInfo.name}</strong></span>
            <span>Skills: <strong>{successInfo.skillsCount}</strong></span>
            <span>Experience: <strong>{successInfo.experienceCount}</strong></span>
          </div>
          <span className="success-hint">The form fields below have been automatically populated.</span>
        </div>
      )}
    </div>
  )
}
