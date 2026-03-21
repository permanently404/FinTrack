import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error(err)

    if (
        typeof err === 'object' && err !== null &&
        'code' in err && (err as { code: string }).code === 'P2025'
    ) {
        res.status(404).json({ error: 'Запись не найдена' })
        return
    }

    const isDev = process.env.NODE_ENV !== 'production'

    if (err instanceof Error) {
        res.status(500).json({
            error: isDev ? err.message : 'Internal server error',
        })
        return
    }

    res.status(500).json({ error: 'Internal server error' })
}
