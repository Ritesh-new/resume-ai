import express from 'express'
import multer from 'multer'
import { Resume } from '../models/Resume'
import { AuthRequest, authMiddleware } from '../middleware/auth'
import { atsOptimizationService, ResumeData } from '../services/atsOptimization'
import { resumeParserService } from '../services/resumeParser'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

// Extract resume details from uploaded file (PDF, DOCX, TXT, JSON)
router.post('/extract', upload.single('file'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const rawText = await resumeParserService.extractTextFromFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    )

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded file' })
    }

    const parsedResume = resumeParserService.parseResumeText(rawText)
    const atsScore = atsOptimizationService.calculateATSScore(parsedResume)

    res.json({
      success: true,
      resume: {
        ...parsedResume,
        atsScore,
      },
      message: 'Resume details extracted successfully',
    })
  } catch (error) {
    console.error('Resume extract error:', error)
    res.status(500).json({ error: 'Failed to extract resume details from file' })
  }
})

// Get all resumes for user
router.get('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resumes = await Resume.find({ userId: req.user?.id })
    res.json(resumes)
  } catch (error) {
    console.error('Fetch resumes error:', error)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

// Create new resume
router.post('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resumeData = req.body as ResumeData

    const atsScore = atsOptimizationService.calculateATSScore(resumeData)

    const resume = new Resume({
      userId: req.user?.id,
      ...resumeData,
      atsScore,
    })

    await resume.save()
    res.status(201).json(resume)
  } catch (error) {
    console.error('Create resume error:', error)
    res.status(500).json({ error: 'Failed to create resume' })
  }
})

// Get specific resume
router.get('/:id', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json(resume)
  } catch (error) {
    console.error('Get resume error:', error)
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// Update resume
router.put('/:id', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resumeData = req.body as ResumeData

    const atsScore = atsOptimizationService.calculateATSScore(resumeData)
    const issues = atsOptimizationService.getATSIssues(resumeData)
    const suggestions = atsOptimizationService.getATSSuggestions(resumeData)

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      {
        ...resumeData,
        atsScore,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json({
      resume,
      atsScore,
      issues,
      suggestions,
    })
  } catch (error) {
    console.error('Update resume error:', error)
    res.status(500).json({ error: 'Failed to update resume' })
  }
})

// Delete resume
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id,
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error('Delete resume error:', error)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

// Get ATS analysis
router.post('/:id/ats-analysis', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    const resumeData = resume.toObject() as unknown as ResumeData
    const score = atsOptimizationService.calculateATSScore(resumeData)
    const issues = atsOptimizationService.getATSIssues(resumeData)
    const suggestions = atsOptimizationService.getATSSuggestions(resumeData)

    res.json({
      score,
      issues,
      suggestions,
    })
  } catch (error) {
    console.error('ATS analysis error:', error)
    res.status(500).json({ error: 'Failed to perform ATS analysis' })
  }
})

export default router
