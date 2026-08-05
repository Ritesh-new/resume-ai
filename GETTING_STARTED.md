# Getting Started - Resume Builder ATS Optimizer

Welcome! Follow these steps to get your resume builder application running.

## Prerequisites

Before starting, ensure you have:
- **Node.js 18+** ([Download](https://nodejs.org)) - **REQUIRED**
- **npm** (comes with Node.js)
- **MongoDB** (local or [Atlas](https://mongodb.com/cloud/atlas))
- **Git** (optional)

## Installation Steps

### 1. Install Dependencies

Open your terminal in the project root and install both frontend and backend packages:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (open new terminal)
cd backend
npm install
```

### 2. Setup Environment Variables

Create `.env` files in both directories:

**`backend/.env`:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

**`frontend/.env`** (optional):
```
VITE_API_URL=http://localhost:5000
```

### 3. Start the Application

Open two terminals in the project root:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✓ Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✓ Frontend will run on `http://localhost:5173`

## Using VS Code Tasks

Alternatively, use VS Code's built-in task runner:

1. Press `Ctrl+Shift+D` (Debug)
2. Select **"Run Frontend & Backend"**
3. Click the play button

Or use the Terminal menu:
1. Go to **Terminal > Run Task**
2. Select **"Frontend: Dev Server"** or **"Backend: Dev Server"**

## Features Ready to Use

✅ **Resume Builder**
- Add personal information
- Add work experience
- Add education
- Add skills

✅ **ATS Optimization**
- Real-time ATS score calculation (0-100)
- Suggestions for improvement
- Best practices tips

✅ **Export**
- Export resume as PDF (ATS-safe formatting)
- Save as JSON

✅ **Templates**
- Modern (default)
- Classic
- Minimal

## Project Structure

```
Resume app/
├── frontend/           # React + TypeScript UI
│   ├── src/
│   │   ├── components/    # Resume sections, export, suggestions
│   │   ├── pages/         # Home, Editor, Dashboard
│   │   ├── utils/         # ATS calculation, PDF export
│   │   ├── store/         # Zustand state management
│   │   └── styles/        # Tailored CSS
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/        # Auth, resumes
│   │   ├── models/        # User, Resume schemas
│   │   ├── services/      # ATS optimization logic
│   │   └── middleware/    # Auth, error handling
│   ├── package.json
│   └── tsconfig.json
│
├── .vscode/           # VS Code settings
│   ├── tasks.json     # Run tasks
│   └── launch.json    # Debug configuration
│
└── .github/
    └── copilot-instructions.md
```

## Next Steps

### After Setup:

1. **Create an Account** (TODO - authentication UI)
2. **Build Your Resume**
   - Go to `/editor`
   - Fill in your information
   - Watch your ATS score update in real-time
3. **Check Tips** - Review ATS suggestions on the page
4. **Export** - Download as PDF or save as JSON

### To Complete These Features:

- [ ] User authentication UI (login/register modal)
- [ ] Resume save/load from database
- [ ] PDF export refinements
- [ ] DOCX export support
- [ ] Resume templates with different layouts
- [ ] Keyword matching suggestions
- [ ] Job description analyzer
- [ ] Cover letter builder

## Troubleshooting

### "npm: command not found"
→ Install Node.js from [nodejs.org](https://nodejs.org)

### "Port 5000 is already in use"
→ Change `PORT` in `backend/.env` to 5001

### "Connection refused (MongoDB)"
→ Either:
- Start MongoDB locally: `mongod`
- Or use MongoDB Atlas (update `MONGODB_URI` in `.env`)

### "Cannot find module"
→ Run `npm install` again in frontend/backend folders

### VITE dev server not starting
→ Try deleting `node_modules/.vite` and restart

## Development Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Check code quality
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # Start dev server with auto-reload
npm run build    # Build TypeScript to JS
npm start        # Run production build
```

## Database Models

### User Schema
```typescript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Resume Schema
```typescript
{
  userId: ObjectId (ref: User),
  title: String,
  personalInfo: {
    fullName, email, phone, location, summary
  },
  experience: Array<{
    company, position, startDate, endDate, description
  }>,
  education: Array<{
    school, degree, field, graduationYear
  }>,
  skills: Array<String>,
  template: 'modern' | 'classic' | 'minimal',
  atsScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Resumes
- `GET /resumes` - Get all resumes
- `POST /resumes` - Create resume
- `GET /resumes/:id` - Get specific resume
- `PUT /resumes/:id` - Update resume
- `DELETE /resumes/:id` - Delete resume
- `POST /resumes/:id/ats-analysis` - Get ATS analysis

## Support

For issues:
1. Check the Troubleshooting section above
2. Review browser console (F12) for frontend errors
3. Check terminal output for backend errors
4. Verify MongoDB connection

## Learn More

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

Happy resume building! 🚀
