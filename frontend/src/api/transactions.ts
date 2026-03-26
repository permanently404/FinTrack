import { Transaction, TransactionFilters, PaginatedResponse } from '@/types'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useTransactionStore } from '@/store/transactionStore'
import { apiClient } from './axios'

async function fetchTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const { data } = await apiClient.get<PaginatedResponse<Transaction>>('/api/transactions', {
        params: filters,
    })
    return data
}

async function addTransaction(body: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data } = await apiClient.post<Transaction>('/api/transactions', body)
    return data
}

async function editTransaction({ id, ...body }: Transaction): Promise<Transaction> {
    const { data } = await apiClient.put<Transaction>(`/api/transactions/${id}`, body)
    return data
}

async function deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/api/transactions/${id}`)
}

export function useTransactions(initialData?: PaginatedResponse<Transaction>) {
    const filters = useTransactionStore((state) => state.filters)

    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => fetchTransactions(filters),
        placeholderData: keepPreviousData,
        ...(initialData && { initialData }),
    })
}

export function useAddTransaction() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: addTransaction,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (error) => {
            alert('Не удалось добавить транзакцию')
            console.error('Add transaction error:', error)
        },
    })
}

export function useEditTransaction() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: editTransaction,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (error) => {
            alert('Не удалось обновить транзакцию')
            console.error('Edit transaction error:', error)
        },
    })
}

export function useDeleteTransaction() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (error) => {
            alert('Не удалось удалить транзакцию')
            console.error('Delete transaction error:', error)
        },
    })
}
