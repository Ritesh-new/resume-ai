import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
  },
  experience: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  education: [
    {
      school: String,
      course: String,
      percentage: String,
      duration: String,
      degree: String,
      field: String,
      graduationYear: String,
    },
  ],
  skills: [String],
  template: {
    type: String,
    enum: ['modern', 'classic', 'minimal'],
    default: 'modern',
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const Resume = mongoose.model('Resume', resumeSchema)
