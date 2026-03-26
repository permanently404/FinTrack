import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import transactionsRouter from './routes/transactions'
import authRouter from './routes/auth'
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT ?? 4000

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000'
app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/transactions', authMiddleware, transactionsRouter)

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
