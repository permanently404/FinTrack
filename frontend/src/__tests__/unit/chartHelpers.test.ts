import { getCategoryExpenses, getMonthlyBalance } from '@/lib/chartHelpers'
import { Transaction } from '@/types'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
    return {
        id: 'test-id',
        title: 'Тест',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: '2026-01-15',
        ...overrides,
    }
}

describe('getCategoryExpenses', () => {

    it('возвращает пустой объект для пустого массива', () => {
        expect(getCategoryExpenses([])).toEqual({})
    })

    it('суммирует расходы по категориям', () => {
        const transactions = [
            makeTransaction({ category: 'food', amount: 300 }),
            makeTransaction({ category: 'food', amount: 200 }),
            makeTransaction({ category: 'transport', amount: 150 }),
        ]

        expect(getCategoryExpenses(transactions)).toEqual({
            food: 500,
            transport: 150,
        })
    })

    it('игнорирует доходы — считает только расходы', () => {
        const transactions = [
            makeTransaction({ type: 'expense', category: 'food', amount: 500 }),
            makeTransaction({ type: 'income', category: 'salary', amount: 9999 }),
        ]

        const result = getCategoryExpenses(transactions)

        expect(result).toEqual({ food: 500 })
        expect(result).not.toHaveProperty('salary')
        expect(Object.values(result)).not.toContain(9999)
    })

    it('если все транзакции — доходы, возвращает пустой объект', () => {
        const transactions = [
            makeTransaction({ type: 'income', category: 'salary', amount: 9999 }),
        ]

        expect(getCategoryExpenses(transactions)).toEqual({})
    })
})

describe('getMonthlyBalance', () => {

    it('возвращает пустой массив для пустого массива транзакций', () => {
        expect(getMonthlyBalance([])).toEqual([])
    })

    it('группирует доходы и расходы по одному месяцу', () => {
        const transactions = [
            makeTransaction({ type: 'income', amount: 10000, date: '2026-03-01' }),
            makeTransaction({ type: 'expense', amount: 3000, date: '2026-03-15' }),
            makeTransaction({ type: 'expense', amount: 2000, date: '2026-03-20' }),
        ]

        const result = getMonthlyBalance(transactions)

        expect(result).toHaveLength(1)

        expect(result[0]).toMatchObject({
            month: 'Мар',
            income: 10000,
            expense: 5000,
            balance: 5000,
        })
    })

    it('сортирует месяцы в хронологическом порядке', () => {
        const transactions = [
            makeTransaction({ date: '2026-03-01' }),
            makeTransaction({ date: '2026-01-01' }),
            makeTransaction({ date: '2026-02-01' }),
        ]

        const result = getMonthlyBalance(transactions)
        const months = result.map((r) => r.month)

        expect(months).toEqual(['Янв', 'Фев', 'Мар'])
    })

    it('возвращает не более 6 последних месяцев', () => {
        const transactions = Array.from({ length: 8 }, (_, i) => {
            const month = String(i + 1).padStart(2, '0')
            return makeTransaction({ date: `2026-${month}-01` })
        })

        const result = getMonthlyBalance(transactions)
        expect(result).toHaveLength(6)
        expect(result[0].month).toBe('Мар')
        expect(result[5].month).toBe('Авг')
    })


    it(('разные годы — одинаковый месяц не объединяется (2025-01 и 2026-01 — это разные ключи)'), () => {
        const transactions = [
            makeTransaction({ date: '2025-01-01' }),
            makeTransaction({ date: '2026-01-01' }),
        ]

        const result = getMonthlyBalance(transactions)

        expect(result).toHaveLength(2)
    })

    it(('месяц без расходов имеет expense: 0 и balance === income'), () => {
        const transactions = [
            makeTransaction({ type: "income" })
        ]

        const result = getMonthlyBalance(transactions)

        expect(result[0].expense).toBe(0);
        expect(result[0].income).toBe(result[0].balance);
    })
})
