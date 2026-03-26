import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'email и password обязательны' })
            return
        }

        if (password.length < 8) {
            res.status(400).json({ error: 'Пароль должен быть не менее 8 символов' })
            return
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            res.status(409).json({ error: 'Пользователь с таким email уже существует' })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        })

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        res.status(201).json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name },
        })
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'email и password обязательны' })
            return
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ error: 'Неверный email или пароль' })
            return
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            res.status(401).json({ error: 'Неверный email или пароль' })
            return
        }

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name },
        })
    } catch (err) {
        next(err)
    }
})

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            res.status(400).json({ error: 'refreshToken обязателен' })
            return
        }

        const payload = verifyRefreshToken(refreshToken)

        const user = await prisma.user.findUnique({ where: { id: payload.userId } })
        if (!user) {
            res.status(401).json({ error: 'Пользователь не найден' })
            return
        }

        const accessToken = generateAccessToken(user.id)
        const newRefreshToken = generateRefreshToken(user.id)

        res.json({ accessToken, refreshToken: newRefreshToken })
    } catch (err) {
        next(err)
    }
})

export default router
