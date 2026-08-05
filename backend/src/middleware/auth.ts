import express from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends express.Request {
  user?: { id: string; email: string }
  token?: string
}

export const authMiddleware = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; email: string }
    req.user = decoded
    req.token = token
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
