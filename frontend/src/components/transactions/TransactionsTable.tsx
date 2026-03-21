'use client'
import { Transaction } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/formatCurrency'
import { formatDate } from '@/lib/formatDate'
import { useTransactionStore } from '@/store/transactionStore'

interface Props {
    transactions: Transaction[]
    total: number
    limit?: number
    className?: string
}

export function TransactionsTable({ transactions, total, limit, className = '' }: Props) {
    const setFilters = useTransactionStore((state) => state.setFilters)
    const page = useTransactionStore((state) => state.filters.page)
    const perPage = useTransactionStore((state) => state.filters.limit)
    const totalPages = Math.ceil(total / perPage)

    const visible = limit ? transactions.slice(0, limit) : transactions

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div data-testid="table-desktop" className="flex-1 overflow-auto min-h-0 hidden sm:block">
                <table className="w-full text-sm table-fixed">
                    <thead className="sticky top-0 bg-card z-10">
                        <tr className="text-muted text-left">
                            <th className="pb-3 px-4 border-b border-border font-medium w-[40%]">Название</th>
                            <th className="pb-3 px-4 border-b border-border font-medium w-[20%]">Категория</th>
                            <th className="pb-3 px-4 border-b border-border font-medium w-[20%]">Дата</th>
                            <th className="pb-3 px-4 border-b border-border font-medium text-right w-[20%]">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((t) => (
                            <tr key={t.id} className="border-b border-border hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 font-medium text-foreground">{t.title}</td>
                                <td className="py-3 px-4">
                                    <Badge variant={t.category} />
                                </td>
                                <td className="py-3 px-4 text-muted">{formatDate(t.date)}</td>
                                <td className={`py-3 px-4 text-right font-semibold ${t.type === 'income' ? 'text-primary' : 'text-expense'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!limit && totalPages > 1 && (
                <div className="hidden sm:flex justify-between items-center gap-3 pt-4 flex-none border-t border-border mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <span>Показывать по:</span>
                        <select
                            value={perPage}
                            onChange={(e) => setFilters({ limit: Number(e.target.value), page: 1 })}
                            className="bg-surface border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilters({ page: Math.max(1, page - 1) })}
                            disabled={page === 1}
                            className="px-3 py-1 rounded border border-border text-foreground disabled:opacity-40 hover:bg-white/5 transition-colors"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1 text-muted flex items-center">{page} / {totalPages}</span>
                        <button
                            onClick={() => setFilters({ page: Math.min(totalPages, page + 1) })}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded border border-border text-foreground disabled:opacity-40 hover:bg-white/5 transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
