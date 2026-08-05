# Resume Builder - ATS Optimized 📄

A full-stack web application for building professional resumes with real-time ATS (Applicant Tracking System) optimization. Get instant feedback on your resume's compatibility with automated screening systems.

## 🎯 Key Features

- ✅ **ATS Score Calculation** - Real-time scoring (0-100) based on ATS best practices
- ✅ **Multiple Templates** - Modern, Classic, and Minimal templates (all ATS-friendly)
- ✅ **PDF Export** - Download resume in ATS-safe PDF format
- ✅ **Live Preview** - See your resume update as you type
- ✅ **Optimization Tips** - Get real-time suggestions for improvement
- ✅ **User Accounts** - Save and manage multiple resumes
- ✅ **Cloud Storage** - MongoDB-backed resume storage
- ✅ **Smart Analysis** - Identifies missing sections and suggests improvements
- ✅ **Keyword Optimization** - Checks for action verbs and quantifiable achievements

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Export**: PDF (jsPDF)
- **State**: Zustand
- **Auth**: JWT

## 📊 ATS Optimization Criteria

The ATS score is calculated based on:

- **Personal Information (15%)** - Name, email, phone, location, summary
- **Experience (30%)** - Company, position, dates, description
- **Education (20%)** - School, degree, field, graduation year
- **Skills (20%)** - Minimum 5-15 skills recommended
- **Keywords (15%)** - Action verbs and quantifiable results
