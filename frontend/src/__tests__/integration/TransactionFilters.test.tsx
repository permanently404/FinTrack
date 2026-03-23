import { render, screen, fireEvent } from '@testing-library/react'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { useTransactionStore } from '@/store/transactionStore'

beforeEach(() => {
    useTransactionStore.setState({
        filters: { category: 'all', type: 'all', dateFrom: '', dateTo: '', search: '', page: 1, limit: 1000 },
    })
})

describe('TransactionFilters', () => {

    it('рендерится без ошибок — все инпуты присутствуют', () => {
        render(<TransactionFilters />)

        expect(screen.getByPlaceholderText('Поиск по названию...')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Все типы')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Все категории')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Сбросить' })).toBeInTheDocument()
    })

    it('ввод текста в поиск → store.filters.search обновляется', () => {
        render(<TransactionFilters />)

        const input = screen.getByPlaceholderText('Поиск по названию...')

        fireEvent.change(input, { target: { value: 'кафе' } })

        expect(useTransactionStore.getState().filters.search).toBe('кафе')
    })

    it('выбор типа income → store.filters.type обновляется', () => {
        render(<TransactionFilters />)

        const typeSelect = screen.getByDisplayValue('Все типы')

        fireEvent.change(typeSelect, { target: { value: 'income' } })

        expect(useTransactionStore.getState().filters.type).toBe('income')
    })

    it('выбор категории food → store.filters.category === "food"', () => {
        render(<TransactionFilters />)

        const typeSelect = screen.getByDisplayValue('Все категории')

        fireEvent.change(typeSelect, { target: { value: 'food' } })

        expect(useTransactionStore.getState().filters.category).toBe('food')
    })

    it('кнопка «Сбросить» → все фильтры возвращаются к дефолтным значениям', () => {
        render(<TransactionFilters />)

        const button = screen.getByRole('button', { name: 'Сбросить' })

        fireEvent.click(button)

        expect(useTransactionStore.getState().filters).toEqual({ category: 'all', type: 'all', dateFrom: '', dateTo: '', search: '', page: 1, limit: 1000 })
    })

})
