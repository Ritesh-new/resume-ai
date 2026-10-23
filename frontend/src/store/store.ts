import { create } from 'zustand'

export interface Resume {
  _id?: string
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
    course: string
    percentage: string
    duration: string
    degree?: string
    field?: string
    graduationYear?: string
  }>
  skills: string[]
  template: 'modern' | 'classic' | 'minimal'
  atsScore?: number
}

interface StoreState {
  isAuthenticated: boolean
  user: { id: string; name: string } | null
  currentResume: Resume | null
  resumes: Resume[]
  setCurrentResume: (resume: Resume | null) => void
  setResumes: (resumes: Resume[]) => void
  setAuthenticated: (value: boolean) => void
  setUser: (user: { id: string; name: string } | null) => void
  initializeAuth: () => void
}

export const useStore = create<StoreState>((set) => ({
  isAuthenticated: false,
  user: null,
  currentResume: null,
  resumes: [],
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setResumes: (resumes) => set({ resumes }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  initializeAuth: () => {
    const token = localStorage.getItem('token')
    if (token) {
      set({ isAuthenticated: true })
    }
  },
}))
