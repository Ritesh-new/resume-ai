import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = express.Router()

// Register
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      password: hashedPassword,
      name,
    })

    await user.save()

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get Profile
router.get('/profile', async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
