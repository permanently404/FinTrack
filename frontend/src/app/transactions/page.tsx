'use client'
import { useEffect, useCallback } from 'react'
import { useTransactions } from '@/api/transactions'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { MobileTransactionList } from '@/components/transactions/MobileTransactionList'
import { useTransactionStore } from '@/store/transactionStore'

const PAGE_SIZE = 20

export default function TransactionsPage() {
    const { data: response, isLoading, isPlaceholderData } = useTransactions()
    const setFilters = useTransactionStore((state) => state.setFilters)
    const page = useTransactionStore((state) => state.filters.page)

    useEffect(() => {
        setFilters({ limit: PAGE_SIZE, page: 1 })
        return () => setFilters({ limit: 1000, page: 1 })
    }, [setFilters])

    const transactions = response?.data || []
    const total = response?.total || 0
    const totalPages = Math.ceil(total / PAGE_SIZE)

    const loadMore = useCallback(() => {
        if (page < totalPages && !isLoading && !isPlaceholderData) {
            setFilters({ page: page + 1 })
        }
    }, [page, totalPages, isLoading, isPlaceholderData, setFilters])

    return (
        <div className="min-h-full lg:h-full lg:overflow-hidden flex flex-col gap-4 p-4 md:p-6">
            <div className="flex flex-none justify-between items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Транзакции</h1>
                <AddTransactionModal />
            </div>

            <Card className="p-3 md:p-4 flex-none">
                <TransactionFilters />
            </Card>

            {isLoading && page === 1 ? (
                <div className="min-h-0">
                    <CardSkeleton />
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <Card className="p-3 md:p-4 flex-col lg:flex-1 lg:min-h-0 lg:overflow-hidden hidden sm:flex">
                        <div className="flex justify-between items-center mb-4 flex-none">
                            <p className="text-sm text-muted">
                                Найдено: {total} транзакций
                            </p>
                        </div>
                        <div className="lg:min-h-0 lg:flex lg:flex-col lg:flex-1">
                            <TransactionsTable
                                transactions={transactions}
                                total={total}
                                className="flex-1"
                            />
                        </div>
                    </Card>

                    {/* Mobile */}
                    <div className="sm:hidden">
                        <p className="text-sm text-muted mb-2">
                            Найдено: {total} транзакций
                        </p>
                        <MobileTransactionList
                            transactions={transactions}
                            page={page}
                            totalPages={totalPages}
                            onLoadMore={loadMore}
                            isLoading={isPlaceholderData}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
