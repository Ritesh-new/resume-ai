# Resume Builder - ATS Optimized - Copilot Instructions

## Project Overview
Full-stack Resume Builder web application with:
- Frontend: React + TypeScript
- Backend: Node.js/Express
- Database: MongoDB (user accounts & resume storage)
- Features: ATS optimization, templates, PDF/DOCX export, user authentication

## Setup Status

- [x] Verify copilot-instructions.md in .github directory exists
- [ ] Scaffold frontend (React + TypeScript) with Vite
- [ ] Scaffold backend (Node.js/Express)
- [ ] Setup database configuration
- [ ] Create ATS optimization utilities
- [ ] Create resume builder components
- [ ] Install dependencies
- [ ] Configure and test application
- [ ] Create run/debug tasks
- [ ] Finalize documentation

## Key Implementation Details

### Frontend Structure
- Components: ResumeBuilder, TemplateSelector, Preview, ExportOptions
- Pages: Home, Editor, Dashboard
- Utilities: ATS checker, PDF export, DOCX export
- State: Resume data management (Context API or Zustand)

### Backend Structure
- Routes: auth, resumes, templates, export
- Middleware: authentication, validation
- Services: ATS analysis, file generation, storage
- Database: MongoDB with Mongoose schemas

### ATS Optimization Rules
- Use standard fonts (Arial, Calibri, Times New Roman)
- Avoid tables, images, graphics
- Use bullet points for content
- Keep formatting simple
- Use standard section headers
- Include relevant keywords
