export type TransactionCategory =
    'food'
    | 'transport'
    | 'entertainment'
    | 'health'
    | 'shopping'
    | 'salary'
    | 'other';

export type TransactionType = 'income' | 'expense'

export interface Transaction {
    id: string,
    title: string,
    amount: number,
    type: TransactionType,
    category: TransactionCategory,
    date: string,
    description?: string,
}

export interface TransactionFilters {
    category: TransactionCategory | 'all',
    type: TransactionType | 'all',
    dateFrom: string,
    dateTo: string,
    search: string,
    page: number,
    limit: number,
}

export interface PaginatedResponse<T> {
    data: T[],
    total: number,
    page: number,
    limit: number,
}

export interface Notification {
    id: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error',
    timestamp: Date,
    read: boolean,
}

export interface AuthUser {
    id: string
    email: string
    name: string | null
}

export interface MonthlyBalance {
    month: string,
    income: number,
    expense: number,
    balance: number,
}

