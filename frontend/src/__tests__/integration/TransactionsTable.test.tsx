import { render, screen, within } from '@testing-library/react'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { makeTransactions } from '../factories'

// Мокаем Zustand store
const mockSetFilters = jest.fn()
let mockPage = 1
let mockLimit = 1000

jest.mock('@/store/transactionStore', () => ({
    useTransactionStore: (selector: (state: unknown) => unknown) => {
        const state = {
            filters: { page: mockPage, limit: mockLimit },
            setFilters: mockSetFilters,
        }
        return selector(state)
    },
}))

beforeEach(() => {
    mockPage = 1
    mockLimit = 1000
    mockSetFilters.mockClear()
})

describe('TransactionsTable', () => {

    it('рендерит названия транзакций на экране', () => {
        const transactions = makeTransactions(3)

        render(<TransactionsTable transactions={transactions} total={3} />)

        const desktop = screen.getByTestId('table-desktop')

        expect(within(desktop).getByText('Транзакция 1')).toBeInTheDocument()
        expect(within(desktop).getByText('Транзакция 2')).toBeInTheDocument()
        expect(within(desktop).getByText('Транзакция 3')).toBeInTheDocument()
    })

    it('при limit={3} показывает только первые 3 из 10 транзакций', () => {
        const transactions = makeTransactions(10)

        render(<TransactionsTable transactions={transactions} total={10} limit={3} />)

        const desktop = screen.getByTestId('table-desktop')

        expect(within(desktop).getByText('Транзакция 1')).toBeInTheDocument()
        expect(within(desktop).getByText('Транзакция 3')).toBeInTheDocument()
        expect(within(desktop).queryByText('Транзакция 4')).not.toBeInTheDocument()
    })

    it('при limit={3} — пагинации нет совсем', () => {
        render(<TransactionsTable transactions={makeTransactions(10)} total={10} limit={3} />)

        expect(screen.queryByRole('button', { name: '→' })).not.toBeInTheDocument()
    })

    it('пагинация появляется когда total > limit', () => {
        mockLimit = 3

        render(<TransactionsTable transactions={makeTransactions(3)} total={10} />)

        expect(screen.getByText('1 / 4')).toBeInTheDocument()
    })

    it('кнопка ← задизейблена на первой странице', () => {
        mockLimit = 3

        render(<TransactionsTable transactions={makeTransactions(3)} total={10} />)

        const prevButton = screen.getByRole('button', { name: '←' })
        expect(prevButton).toBeDisabled()
    })

    it('кнопка → не задизейблена на первой странице при наличии следующих страниц', () => {
        mockLimit = 3

        render(<TransactionsTable transactions={makeTransactions(3)} total={10} />)

        const nextButton = screen.getByRole('button', { name: '→' })
        expect(nextButton).not.toBeDisabled()
    })
})
