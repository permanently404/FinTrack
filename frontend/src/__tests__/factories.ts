import { Transaction, TransactionFilters } from '@/types'

export function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
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

export function makeTransactions(count: number) {
    return Array.from({ length: count }, (_, i) =>
        makeTransaction({ id: `id-${i}`, title: `Транзакция ${i + 1}` })
    )
}

export function makeFilters(overrides: Partial<TransactionFilters> = {}): TransactionFilters {
    return {
        category: 'all',
        type: 'all',
        dateFrom: '',
        dateTo: '',
        search: '',
        page: 1,
        limit: 1000,
        ...overrides,
    }
}
