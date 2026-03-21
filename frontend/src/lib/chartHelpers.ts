import { Transaction, MonthlyBalance } from '@/types'

export function getMonthlyBalance(transactions: Transaction[]): MonthlyBalance[] {
    const months: Record<string, { income: number; expense: number }> = {}

    transactions.forEach((t) => {
        const date = new Date(t.date)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!months[key]) months[key] = { income: 0, expense: 0 }
        if (t.type === 'income') months[key].income += t.amount
        else months[key].expense += t.amount
    })

    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

    return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([key, values]) => {
            const month = parseInt(key.split('-')[1]) - 1
            return {
                month: monthNames[month],
                income: values.income,
                expense: values.expense,
                balance: values.income - values.expense,
            }
        })
}

export function getCategoryExpenses(transactions: Transaction[]): Record<string, number> {
    return transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
        }, {} as Record<string, number>)
}