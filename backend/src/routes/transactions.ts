import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, type, dateFrom, dateTo, search } = req.query as Record<string, string>

        const page = Math.max(1, parseInt(req.query.page as string) || 1)
        const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit as string) || 1000))
        const skip = (page - 1) * limit

        const where = {
            ...(category && category !== 'all' && { category }),
            ...(type && type !== 'all' && { type }),
            ...(dateFrom && { date: { gte: dateFrom } }),
            ...(dateTo && { date: { lte: dateTo } }),
            ...(search && {
                title: { contains: search, mode: 'insensitive' as const },
            }),
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                take: limit,
                skip,
            }),
            prisma.transaction.count({ where }),
        ])

        res.json({ data: transactions, total, page, limit })
    } catch (err) {
        next(err)
    }
})

router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [incomeResult, expenseResult] = await Promise.all([
            prisma.transaction.aggregate({
                where: { type: 'income' },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: { type: 'expense' },
                _sum: { amount: true }
            }),
        ])

        const income = incomeResult._sum.amount ?? 0
        const expense = expenseResult._sum.amount ?? 0

        res.json({
            income,
            expense,
            balance: income - expense
        })
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const transaction = await prisma.transaction.findUnique({
            where: { id },
        })

        if (!transaction) {
            res.status(404).json({ error: 'Транзакция не найдена' })
            return
        }

        res.json(transaction)
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, amount, type, category, date, description } = req.body

        if (!title || !amount || !type || !category || !date) {
            res.status(400).json({ error: 'Обязательные поля: title, amount, type, category, date' })
            return
        }

        if (type !== 'income' && type !== 'expense') {
            res.status(400).json({ error: 'Тип операции не соответствует заявленным типам' })
            return
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(400).json({ error: 'amount должен быть положительным числом' })
            return
        }

        const transaction = await prisma.transaction.create({
            data: { title, amount: Number(amount), type, category, date, description },
        })

        res.status(201).json(transaction)
    } catch (err) {
        next(err)
    }
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { title, amount, type, category, date, description } = req.body

        if (type !== undefined && type !== 'income' && type !== 'expense') {
            res.status(400).json({ error: 'type должен быть income или expense' })
            return
        }

        if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) <= 0)) {
            res.status(400).json({ error: 'amount должен быть положительным числом' })
            return
        }

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(amount !== undefined && { amount: Number(amount) }),
                ...(type !== undefined && { type }),
                ...(category !== undefined && { category }),
                ...(date !== undefined && { date }),
                ...(description !== undefined && { description }),
            },
        })

        res.json(transaction)
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        await prisma.transaction.delete({ where: { id } })

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default router
