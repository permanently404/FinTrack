import { create } from 'zustand'
import { TransactionFilters } from '@/types'

interface TransactionStore {
    filters: TransactionFilters
    setFilters: (filters: Partial<TransactionFilters>) => void
    resetFilters: () => void

    isAddModalOpen: boolean
    openAddModal: () => void
    closeAddModal: () => void

    // Какую транзакцию редактируем (null = создаём новую)
    editingId: string | null
    setEditingId: (id: string | null) => void
}

const defaultFilters: TransactionFilters = {
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    page: 1,
    limit: 1000,
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    filters: defaultFilters,
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    resetFilters: () => set({ filters: defaultFilters }),

    isAddModalOpen: false,
    openAddModal: () => set({ isAddModalOpen: true }),
    closeAddModal: () => set({ isAddModalOpen: false, editingId: null }),

    editingId: null,
    setEditingId: (id) => set({ editingId: id, isAddModalOpen: true }),
}))