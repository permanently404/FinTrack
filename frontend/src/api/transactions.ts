import axios from 'axios'
import { Transaction, TransactionFilters, PaginatedResponse } from '@/types'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useTransactionStore } from '@/store/transactionStore'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function fetchTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const { data } = await axios.get<PaginatedResponse<Transaction>>(`${API}/api/transactions`, {
        params: filters,
    })
    return data
}

async function addTransaction(body: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data } = await axios.post<Transaction>(`${API}/api/transactions`, body)
    return data
}

async function editTransaction({ id, ...body }: Transaction): Promise<Transaction> {
    const { data } = await axios.put<Transaction>(`${API}/api/transactions/${id}`, body)
    return data
}

async function deleteTransaction(id: string): Promise<void> {
    await axios.delete(`${API}/api/transactions/${id}`)
}

export function useTransactions() {
    const filters = useTransactionStore((state) => state.filters)

    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => fetchTransactions(filters),
        placeholderData: keepPreviousData,
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
