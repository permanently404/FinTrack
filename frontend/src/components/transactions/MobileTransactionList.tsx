'use client'
import { useEffect, useRef, useState } from 'react'
import { Transaction } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDate } from '@/lib/formatDate'

interface Props {
    transactions: Transaction[]
    page: number
    totalPages: number
    onLoadMore: () => void
    isLoading?: boolean
}

export function MobileTransactionList({ transactions, page, totalPages, onLoadMore, isLoading }: Props) {
    const [items, setItems] = useState<Transaction[]>(transactions)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const hasMore = page < totalPages

    /* eslint-disable react-hooks/set-state-in-effect */
    // accumulate pages for infinite scroll
    useEffect(() => {
        if (page === 1) {
            setItems(transactions)
        } else {
            setItems((prev) => {
                const existingIds = new Set(prev.map((t) => t.id))
                const newItems = transactions.filter((t) => !existingIds.has(t.id))
                return [...prev, ...newItems]
            })
        }
    }, [transactions, page])
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || !hasMore || isLoading) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, isLoading, onLoadMore])

    return (
        <div className="flex flex-col gap-2 sm:hidden">
            {items.map((t) => (
                <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border"
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-medium text-foreground text-sm truncate">{t.title}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={t.category} />
                            <span className="text-xs text-muted">{formatDate(t.date)}</span>
                        </div>
                    </div>
                    <span className={`text-sm font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-primary' : 'text-expense'
                        }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                </div>
            ))}

            {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    {isLoading ? (
                        <span className="text-sm text-muted">Загрузка...</span>
                    ) : (
                        <span className="text-sm text-muted">Скролльте вниз</span>
                    )}
                </div>
            )}
        </div>
    )
}
