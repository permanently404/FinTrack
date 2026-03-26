import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwt'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Токен не предоставлен' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = verifyAccessToken(token)
        req.userId = payload.userId
        next()
    } catch {
        res.status(401).json({ error: 'Токен недействителен или истёк' })
    }
}