import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import resumeRoutes from './routes/resumes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder')
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ message: 'Resume Builder API is running' })
})

app.use('/auth', authRoutes)
app.use('/resumes', resumeRoutes)

// Basic error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Resume Builder API running on http://localhost:${PORT}`)
  })
}

startServer()
